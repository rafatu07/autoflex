package com.autoflex.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "raw_material")
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String code;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @DecimalMin(value = "0", inclusive = true)
    @Column(name = "stock_quantity", nullable = false, precision = 19, scale = 4)
    private BigDecimal stockQuantity;

    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductRawMaterial> products = new ArrayList<>();

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

    public BigDecimal getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(BigDecimal stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public List<ProductRawMaterial> getProducts() {
        return products;
    }

    public void setProducts(List<ProductRawMaterial> products) {
        this.products = products;
    }
}
