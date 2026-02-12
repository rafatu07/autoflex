package com.autoflex.inventory.repository;

import com.autoflex.inventory.entity.ProductRawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ProductRawMaterialRepository implements PanacheRepository<ProductRawMaterial> {

    public List<ProductRawMaterial> findByProductId(Long productId) {
        return list("product.id", productId);
    }

    public long deleteByProductId(Long productId) {
        return delete("product.id", productId);
    }
}
