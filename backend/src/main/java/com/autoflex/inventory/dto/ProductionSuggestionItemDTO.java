package com.autoflex.inventory.dto;

import java.math.BigDecimal;

public class ProductionSuggestionItemDTO {

    private Long productId;
    private String productCode;
    private String productName;
    private Long quantity;
    private BigDecimal valuePerUnit;
    private BigDecimal totalValue;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getValuePerUnit() {
        return valuePerUnit;
    }

    public void setValuePerUnit(BigDecimal valuePerUnit) {
        this.valuePerUnit = valuePerUnit;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }
}
