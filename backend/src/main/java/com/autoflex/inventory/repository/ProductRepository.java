package com.autoflex.inventory.repository;

import com.autoflex.inventory.entity.Product;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class ProductRepository implements PanacheRepository<Product> {

    public Optional<Product> findByCode(String code) {
        return find("code", code).firstResultOptional();
    }

    public Optional<Product> findByCodeExcludingId(String code, Long excludeId) {
        return find("code = ?1 and id != ?2", code, excludeId).firstResultOptional();
    }
}
