package com.autoflex.inventory.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductionSuggestionResponseDTO {

    private List<ProductionSuggestionItemDTO> items = new ArrayList<>();
    private BigDecimal totalValue = BigDecimal.ZERO;

    public List<ProductionSuggestionItemDTO> getItems() {
        return items;
    }

    public void setItems(List<ProductionSuggestionItemDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue != null ? totalValue : BigDecimal.ZERO;
    }
}
