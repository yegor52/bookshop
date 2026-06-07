package com.book_shop_backend.service;

import com.book_shop_backend.dto.admin.employee.AdminEmployeeRegisterRequest;
import com.book_shop_backend.dto.admin.employee.AdminEmployeeRequest;
import com.book_shop_backend.dto.admin.employee.AdminEmployeeResponse;
import com.book_shop_backend.entity.Employee;
import com.book_shop_backend.entity.Order;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.enums.UserStatus;
import com.book_shop_backend.repository.EmployeeRepository;
import com.book_shop_backend.repository.OrderRepository;
import com.book_shop_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminEmployeeService {
    @Autowired // или через конструктор
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    private final OrderRepository orderRepository;


    public AdminEmployeeService(PasswordEncoder passwordEncoder, EmployeeRepository employeeRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.passwordEncoder = passwordEncoder;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public AdminEmployeeResponse register(AdminEmployeeRegisterRequest request) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new RuntimeException("Login already exists");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setLogin(request.getLogin());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.valueOf(request.getRole())); // ADMIN или MANAGER
        User savedUser = userRepository.save(user);

        Employee employee = new Employee();
        employee.setUser(savedUser);
        employee.setFio(request.getFio());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setEmail(request.getEmail());
        employee.setPosition(request.getPosition());
        return map(employeeRepository.save(employee));
    }

    public List<AdminEmployeeResponse> getAll() {
        return employeeRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public AdminEmployeeResponse getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return map(employee);
    }

    public AdminEmployeeResponse create(AdminEmployeeRequest request) {

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Employee employee = new Employee();
        employee.setUser(user);
        employee.setFio(request.getFio());
        employee.setPosition(request.getPosition());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setEmail(request.getEmail());

        return map(employeeRepository.save(employee));
    }

    public AdminEmployeeResponse update(Long id, AdminEmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (!employee.getEmail().equals(request.getEmail())
                && employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        employee.setUser(user);
        employee.setFio(request.getFio());
        employee.setPosition(request.getPosition());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setEmail(request.getEmail());

        return map(employeeRepository.save(employee));
    }

    public void delete(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Employee systemEmployee = employeeRepository
                .findByUser_Login("deleted_employee")
                .orElseThrow(() -> new RuntimeException("System employee not found"));

        // 1. переназначаем заказы
        List<Order> orders = orderRepository.findAllByEmployee_Id(
                employee.getId()
        );

        for (Order order : orders) {
            order.setEmployee(systemEmployee);
        }

        orderRepository.saveAll(orders);

        // 2. Сохраняем ссылку на User до удаления Employee
        User user = employee.getUser();

        // 3. удаляем employee
        employeeRepository.delete(employee);

        // 4. удаляем User (защита от случайного удаления системного)
        if (!user.getLogin().equals("deleted_employee")) {
            userRepository.delete(user);
        }
    }

    private AdminEmployeeResponse map(Employee e) {
        return new AdminEmployeeResponse(
                e.getId(),
                e.getUser().getId(),
                e.getFio(),
                e.getPosition(),
                e.getPhoneNumber(),
                e.getEmail(),
                e.getUser().getStatus().name(),   // role
                e.getUser().getLogin()            // login
        );
    }
}