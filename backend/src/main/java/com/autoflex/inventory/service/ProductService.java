package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.PageResponseDTO;
import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.dto.ProductRawMaterialItemDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.entity.ProductRawMaterial;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.ProductRawMaterialRepository;
import com.autoflex.inventory.repository.ProductRepository;
import com.autoflex.inventory.repository.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import io.quarkus.panache.common.Page;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    @Inject
    ProductRawMaterialRepository productRawMaterialRepository;

    public List<ProductDTO> findAll() {
        return productRepository.listAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PageResponseDTO<ProductDTO> findPage(int page, int size) {
        List<Product> list = productRepository.findAll().page(Page.of(page, size)).list();
        long total = productRepository.count();
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;
        List<ProductDTO> content = list.stream().map(this::toDTO).collect(Collectors.toList());
        PageResponseDTO<ProductDTO> dto = new PageResponseDTO<>();
        dto.setContent(content);
        dto.setTotalElements(total);
        dto.setTotalPages(totalPages);
        dto.setNumber(page);
        dto.setSize(size);
        return dto;
    }

    public ProductDTO findById(Long id) {
        Product product = productRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
        return toDTO(product);
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        if (productRepository.findByCode(dto.getCode()).isPresent()) {
            throw new ConflictException("Product code already exists: " + dto.getCode());
        }
        Product entity = toEntity(dto);
        productRepository.persist(entity);
        updateRawMaterials(entity, dto.getRawMaterials());
        return toDTO(productRepository.findById(entity.getId()));
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = productRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
        if (productRepository.findByCodeExcludingId(dto.getCode(), id).isPresent()) {
            throw new ConflictException("Product code already exists: " + dto.getCode());
        }
        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setValue(dto.getValue());
        productRepository.persist(product);
        updateRawMaterials(product, dto.getRawMaterials());
        return toDTO(productRepository.findById(id));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.deleteById(id)) {
            throw new NotFoundException("Product not found: " + id);
        }
    }

    private void updateRawMaterials(Product product, List<ProductRawMaterialItemDTO> items) {
        productRawMaterialRepository.deleteByProductId(product.getId());
        product.getRawMaterials().clear();
        if (items == null || items.isEmpty()) return;
        for (ProductRawMaterialItemDTO item : items) {
            RawMaterial rm = rawMaterialRepository.findByIdOptional(item.getRawMaterialId())
                    .orElseThrow(() -> new NotFoundException("Raw material not found: " + item.getRawMaterialId()));
            ProductRawMaterial prm = new ProductRawMaterial();
            prm.setProduct(product);
            prm.setRawMaterial(rm);
            prm.setQuantityRequired(item.getQuantityRequired());
            product.getRawMaterials().add(prm);
            productRawMaterialRepository.persist(prm);
        }
    }

    private Product toEntity(ProductDTO dto) {
        Product p = new Product();
        p.setId(dto.getId());
        p.setCode(dto.getCode());
        p.setName(dto.getName());
        p.setValue(dto.getValue());
        return p;
    }

    private ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setName(p.getName());
        dto.setValue(p.getValue());
        dto.setRawMaterials(p.getRawMaterials().stream().map(prm -> {
            ProductRawMaterialItemDTO item = new ProductRawMaterialItemDTO();
            item.setId(prm.getId());
            item.setRawMaterialId(prm.getRawMaterial().getId());
            item.setRawMaterialCode(prm.getRawMaterial().getCode());
            item.setRawMaterialName(prm.getRawMaterial().getName());
            item.setQuantityRequired(prm.getQuantityRequired());
            return item;
        }).collect(Collectors.toList()));
        return dto;
    }
}
