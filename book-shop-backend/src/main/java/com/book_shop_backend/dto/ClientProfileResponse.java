package com.book_shop_backend.dto;

public class ClientProfileResponse {

    private UserInfo user;
    private ClientInfo client;

    public ClientProfileResponse() {
    }

    public ClientProfileResponse(UserInfo user, ClientInfo client) {
        this.user = user;
        this.client = client;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public ClientInfo getClient() {
        return client;
    }

    public void setClient(ClientInfo client) {
        this.client = client;
    }

    public static class UserInfo {

        private Long id;
        private String login;
        private String role;

        public UserInfo() {
        }

        public UserInfo(Long id, String login, String role) {
            this.id = id;
            this.login = login;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getLogin() {
            return login;
        }

        public void setLogin(String login) {
            this.login = login;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class ClientInfo {

        private Long clientId;
        private String fullName;
        private String phoneNumber;
        private String email;

        public ClientInfo() {
        }

        public ClientInfo(Long clientId, String fullName, String phoneNumber, String email) {
            this.clientId = clientId;
            this.fullName = fullName;
            this.phoneNumber = phoneNumber;
            this.email = email;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}