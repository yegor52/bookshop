package com.book_shop_backend.config;

import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.Employee;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.enums.UserStatus;
import com.book_shop_backend.repository.ClientRepository;
import com.book_shop_backend.repository.EmployeeRepository;
import com.book_shop_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SystemDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    private final ClientRepository clientRepository;

    public SystemDataInitializer(UserRepository userRepository,
                                 EmployeeRepository employeeRepository, ClientRepository clientRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public void run(String... args) {

        createDeletedEmployeeIfNotExists();

        createDeletedClientIfNotExists();
    }

    private void createDeletedEmployeeIfNotExists() {

        String systemLogin = "deleted_employee";

        User systemUser = userRepository.findAll()
                .stream()
                .filter(u -> systemLogin.equals(u.getLogin()))
                .findFirst()
                .orElseGet(() -> {

                    User u = new User();
                    u.setLogin(systemLogin);
                    u.setPassword("SYSTEM"); // не используется
                    u.setStatus(UserStatus.MANAGER);

                    return userRepository.save(u);
                });

        boolean employeeExists = employeeRepository.findAll()
                .stream()
                .anyMatch(e -> e.getUser().getId().equals(systemUser.getId()));

        if (!employeeExists) {

            Employee employee = new Employee();
            employee.setUser(systemUser);
            employee.setFio("Удалённый сотрудник");
            employee.setPosition("SYSTEM");
            employee.setPhoneNumber("SYSTEM");
            employee.setEmail("deleted-employee@system.local");

            employeeRepository.save(employee);
        }
    }

    private void createDeletedClientIfNotExists() {

        String systemLogin = "deleted_client";

        User systemUser = userRepository.findAll()
                .stream()
                .filter(u -> systemLogin.equals(u.getLogin()))
                .findFirst()
                .orElseGet(() -> {

                    User u = new User();
                    u.setLogin(systemLogin);
                    u.setPassword("SYSTEM");
                    u.setStatus(UserStatus.CLIENT);

                    return userRepository.save(u);
                });

        boolean clientExists = clientRepository.findAll()
                .stream()
                .anyMatch(c ->
                        c.getUser().getId()
                                .equals(systemUser.getId())
                );

        if (!clientExists) {

            Client client = new Client();

            client.setUser(systemUser);
            client.setFio("Удалённый пользователь");
            client.setPhoneNumber("SYSTEM");
            client.setEmail("deleted-client@system.local");

            clientRepository.save(client);
        }
    }
}