package com.autoflex.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductDTO {

    private Long id;
    @NotBlank
    private String code;
    @NotBlank
    private String name;
    @NotNull
    @DecimalMin(value = "0", inclusive = true)
    private BigDecimal value;
    private List<ProductRawMaterialItemDTO> rawMaterials = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public List<ProductRawMaterialItemDTO> getRawMaterials() {
        return rawMaterials;
    }

    public void setRawMaterials(List<ProductRawMaterialItemDTO> rawMaterials) {
        this.rawMaterials = rawMaterials != null ? rawMaterials : new ArrayList<>();
    }
}
