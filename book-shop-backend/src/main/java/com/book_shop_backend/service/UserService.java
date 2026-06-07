package com.book_shop_backend.service;

import com.book_shop_backend.dto.ClientProfileResponse;
import com.book_shop_backend.dto.EmployeeProfileResponse;
import com.book_shop_backend.dto.UpdateClientProfileRequest;
import com.book_shop_backend.dto.UpdateClientProfileResponse;
import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.Employee;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.repository.ClientRepository;
import com.book_shop_backend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;

    public UserService(ClientRepository clientRepository,
                           EmployeeRepository employeeRepository) {
        this.clientRepository = clientRepository;
        this.employeeRepository = employeeRepository;
    }

    public ClientProfileResponse getClientProfile(User user) {

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Client not found for user id: " + user.getId())
                );

        ClientProfileResponse.UserInfo userInfo =
                new ClientProfileResponse.UserInfo(
                        user.getId(),
                        user.getLogin(),
                        user.getStatus().name()
                );

        ClientProfileResponse.ClientInfo clientInfo =
                new ClientProfileResponse.ClientInfo(
                        client.getId(),
                        client.getFio(),
                        client.getPhoneNumber(),
                        client.getEmail()
                );

        return new ClientProfileResponse(userInfo, clientInfo);
    }

    public UpdateClientProfileResponse updateClientProfile(User user,
                                                           UpdateClientProfileRequest request) {

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Client not found for user id: " + user.getId())
                );

        // Проверка уникальности email (исключаем текущего клиента)
        if (!client.getEmail().equals(request.getEmail())
                && clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use by another client");
        }

        client.setFio(request.getFullName());
        client.setPhoneNumber(request.getPhoneNumber());
        client.setEmail(request.getEmail());

        Client updated = clientRepository.save(client);

        return new UpdateClientProfileResponse(
                updated.getId(),
                updated.getFio(),
                updated.getPhoneNumber(),
                updated.getEmail()
        );
    }

    public EmployeeProfileResponse getEmployeeProfile(User user) {

        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found for user id: " + user.getId())
                );

        EmployeeProfileResponse.UserInfo userInfo =
                new EmployeeProfileResponse.UserInfo(
                        user.getId(),
                        user.getLogin(),
                        user.getStatus().name()
                );

        EmployeeProfileResponse.EmployeeInfo employeeInfo =
                new EmployeeProfileResponse.EmployeeInfo(
                        employee.getId(),
                        employee.getFio(),
                        employee.getPosition(),
                        employee.getPhoneNumber(),
                        employee.getEmail()
                );

        return new EmployeeProfileResponse(userInfo, employeeInfo);
    }
}