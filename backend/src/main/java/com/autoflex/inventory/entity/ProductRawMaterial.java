package com.autoflex.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "product_raw_material", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "raw_material_id"})
})
public class ProductRawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;

    @NotNull
    @DecimalMin(value = "0.0001", inclusive = false)
    @Column(name = "quantity_required", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityRequired;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public RawMaterial getRawMaterial() {
        return rawMaterial;
    }

    public void setRawMaterial(RawMaterial rawMaterial) {
        this.rawMaterial = rawMaterial;
    }

    public BigDecimal getQuantityRequired() {
        return quantityRequired;
    }

    public void setQuantityRequired(BigDecimal quantityRequired) {
        this.quantityRequired = quantityRequired;
    }
}
