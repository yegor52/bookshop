package com.book_shop_backend.dto.manager;

import java.util.List;

public class ManagerOrderDetailsResponse
        extends ManagerOrderResponse {

    private List<ManagerOrderItemResponse> items;

    public ManagerOrderDetailsResponse() {
    }

    public ManagerOrderDetailsResponse(List<ManagerOrderItemResponse> items) {
        this.items = items;
    }

    public List<ManagerOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<ManagerOrderItemResponse> items) {
        this.items = items;
    }
}