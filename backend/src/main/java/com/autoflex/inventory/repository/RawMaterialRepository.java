package com.autoflex.inventory.repository;

import com.autoflex.inventory.entity.RawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class RawMaterialRepository implements PanacheRepository<RawMaterial> {

    public Optional<RawMaterial> findByCode(String code) {
        return find("code", code).firstResultOptional();
    }

    public Optional<RawMaterial> findByCodeExcludingId(String code, Long excludeId) {
        return find("code = ?1 and id != ?2", code, excludeId).firstResultOptional();
    }
}
