package com.book_shop_backend.dto;

public class EmployeeProfileResponse {

    private UserInfo user;
    private EmployeeInfo employee;

    public EmployeeProfileResponse() {
    }

    public EmployeeProfileResponse(UserInfo user, EmployeeInfo employee) {
        this.user = user;
        this.employee = employee;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public EmployeeInfo getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeInfo employee) {
        this.employee = employee;
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

    public static class EmployeeInfo {

        private Long employeeId;
        private String fullName;
        private String position;
        private String phoneNumber;
        private String email;

        public EmployeeInfo() {
        }

        public EmployeeInfo(Long employeeId,
                            String fullName,
                            String position,
                            String phoneNumber,
                            String email) {
            this.employeeId = employeeId;
            this.fullName = fullName;
            this.position = position;
            this.phoneNumber = phoneNumber;
            this.email = email;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
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