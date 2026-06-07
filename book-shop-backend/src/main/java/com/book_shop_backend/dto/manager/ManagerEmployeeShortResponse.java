package com.book_shop_backend.dto.manager;

public class ManagerEmployeeShortResponse {

    private Long id;
    private String fio;
    private String position;

    public ManagerEmployeeShortResponse() {
    }

    public ManagerEmployeeShortResponse(Long id,
                                        String fio,
                                        String position) {
        this.id = id;
        this.fio = fio;
        this.position = position;
    }

    public Long getId() {
        return id;
    }

    public String getFio() {
        return fio;
    }

    public String getPosition() {
        return position;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFio(String fio) {
        this.fio = fio;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}