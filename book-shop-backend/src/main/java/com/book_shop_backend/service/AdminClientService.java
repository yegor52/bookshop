package com.book_shop_backend.service;

import com.book_shop_backend.dto.admin.client.AdminClientRequest;
import com.book_shop_backend.dto.admin.client.AdminClientResponse;
import com.book_shop_backend.entity.Client;
import com.book_shop_backend.entity.Order;
import com.book_shop_backend.entity.User;
import com.book_shop_backend.repository.ClientRepository;
import com.book_shop_backend.repository.OrderRepository;
import com.book_shop_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminClientService(
            ClientRepository clientRepository,
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<AdminClientResponse> getAll() {

        return clientRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public AdminClientResponse getById(Long id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client not found"
                        )
                );

        return map(client);
    }

    public AdminClientResponse create(
            AdminClientRequest request
    ) {

        if (clientRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "User not found"
                )
        );

        Client client = new Client();

        client.setUser(user);
        client.setFio(request.getFio());
        client.setPhoneNumber(
                request.getPhoneNumber()
        );
        client.setEmail(request.getEmail());

        return map(
                clientRepository.save(client)
        );
    }

    public AdminClientResponse update(
            Long id,
            AdminClientRequest request
    ) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client not found"
                        )
                );

        if (!client.getEmail()
                .equals(request.getEmail())
                &&
                clientRepository.existsByEmail(
                        request.getEmail()
                )) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "User not found"
                )
        );

        client.setUser(user);
        client.setFio(request.getFio());
        client.setPhoneNumber(
                request.getPhoneNumber()
        );
        client.setEmail(request.getEmail());

        return map(
                clientRepository.save(client)
        );
    }

    public void delete(Long id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client not found"
                        )
                );

        Client deletedClient =
                clientRepository.findByUser_Login(
                        "deleted_client"
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Deleted client system entity not found"
                        )
                );

        List<Order> orders =
                orderRepository.findAllByClient_Id(
                        client.getId()
                );

        for (Order order : orders) {
            order.setClient(deletedClient);
        }

        orderRepository.saveAll(orders);

        User user = client.getUser();

        clientRepository.delete(client);

        userRepository.delete(user);
    }

    private AdminClientResponse map(Client client) {

        return new AdminClientResponse(
                client.getId(),
                client.getUser().getId(),
                client.getFio(),
                client.getPhoneNumber(),
                client.getEmail()
        );
    }
}