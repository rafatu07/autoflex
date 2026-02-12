package com.autoflex.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ProductRawMaterialItemDTO {

    private Long id;
    @NotNull
    private Long rawMaterialId;
    private String rawMaterialCode;
    private String rawMaterialName;
    @NotNull
    @DecimalMin(value = "0.0001", inclusive = false)
    private BigDecimal quantityRequired;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRawMaterialId() {
        return rawMaterialId;
    }

    public void setRawMaterialId(Long rawMaterialId) {
        this.rawMaterialId = rawMaterialId;
    }

    public String getRawMaterialCode() {
        return rawMaterialCode;
    }

    public void setRawMaterialCode(String rawMaterialCode) {
        this.rawMaterialCode = rawMaterialCode;
    }

    public String getRawMaterialName() {
        return rawMaterialName;
    }

    public void setRawMaterialName(String rawMaterialName) {
        this.rawMaterialName = rawMaterialName;
    }

    public BigDecimal getQuantityRequired() {
        return quantityRequired;
    }

    public void setQuantityRequired(BigDecimal quantityRequired) {
        this.quantityRequired = quantityRequired;
    }
}
