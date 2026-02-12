package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductionSuggestionItemDTO;
import com.autoflex.inventory.dto.ProductionSuggestionResponseDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.entity.ProductRawMaterial;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.ProductRepository;
import com.autoflex.inventory.repository.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductionSuggestionService {

    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    public ProductionSuggestionResponseDTO compute() {
        List<RawMaterial> allRawMaterials = rawMaterialRepository.listAll();
        Map<Long, BigDecimal> availableStock = new HashMap<>();
        for (RawMaterial rm : allRawMaterials) {
            availableStock.put(rm.getId(), rm.getStockQuantity() != null ? rm.getStockQuantity() : BigDecimal.ZERO);
        }

        List<Product> productsByValueDesc = productRepository.listAll().stream()
                .sorted((a, b) -> {
                    BigDecimal va = a.getValue() != null ? a.getValue() : BigDecimal.ZERO;
                    BigDecimal vb = b.getValue() != null ? b.getValue() : BigDecimal.ZERO;
                    return vb.compareTo(va);
                })
                .collect(Collectors.toList());

        ProductionSuggestionResponseDTO response = new ProductionSuggestionResponseDTO();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (Product product : productsByValueDesc) {
            if (product.getRawMaterials() == null || product.getRawMaterials().isEmpty()) continue;

            long maxUnits = Long.MAX_VALUE;
            for (ProductRawMaterial prm : product.getRawMaterials()) {
                Long rmId = prm.getRawMaterial().getId();
                BigDecimal required = prm.getQuantityRequired() != null ? prm.getQuantityRequired() : BigDecimal.ZERO;
                if (required.compareTo(BigDecimal.ZERO) <= 0) continue;
                BigDecimal stock = availableStock.getOrDefault(rmId, BigDecimal.ZERO);
                long units = stock.divide(required, 0, RoundingMode.FLOOR).longValue();
                if (units < maxUnits) maxUnits = units;
            }

            if (maxUnits <= 0) continue;

            long producibleQuantity = maxUnits;
            for (ProductRawMaterial prm : product.getRawMaterials()) {
                Long rmId = prm.getRawMaterial().getId();
                BigDecimal required = prm.getQuantityRequired();
                BigDecimal consumed = required.multiply(BigDecimal.valueOf(producibleQuantity));
                availableStock.merge(rmId, consumed.negate(), BigDecimal::add);
            }

            BigDecimal valuePerUnit = product.getValue() != null ? product.getValue() : BigDecimal.ZERO;
            BigDecimal itemTotal = valuePerUnit.multiply(BigDecimal.valueOf(producibleQuantity));
            totalValue = totalValue.add(itemTotal);

            ProductionSuggestionItemDTO item = new ProductionSuggestionItemDTO();
            item.setProductId(product.getId());
            item.setProductCode(product.getCode());
            item.setProductName(product.getName());
            item.setQuantity(producibleQuantity);
            item.setValuePerUnit(valuePerUnit);
            item.setTotalValue(itemTotal);
            response.getItems().add(item);
        }

        response.setTotalValue(totalValue);
        return response;
    }
}
