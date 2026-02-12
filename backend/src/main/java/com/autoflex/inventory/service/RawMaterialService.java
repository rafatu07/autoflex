package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.PageResponseDTO;
import com.autoflex.inventory.dto.RawMaterialDTO;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import io.quarkus.panache.common.Page;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class RawMaterialService {

    @Inject
    RawMaterialRepository rawMaterialRepository;

    public List<RawMaterialDTO> findAll() {
        return rawMaterialRepository.listAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PageResponseDTO<RawMaterialDTO> findPage(int page, int size) {
        List<RawMaterial> list = rawMaterialRepository.findAll().page(Page.of(page, size)).list();
        long total = rawMaterialRepository.count();
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;
        List<RawMaterialDTO> content = list.stream().map(this::toDTO).collect(Collectors.toList());
        PageResponseDTO<RawMaterialDTO> dto = new PageResponseDTO<>();
        dto.setContent(content);
        dto.setTotalElements(total);
        dto.setTotalPages(totalPages);
        dto.setNumber(page);
        dto.setSize(size);
        return dto;
    }

    public RawMaterialDTO findById(Long id) {
        RawMaterial rm = rawMaterialRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + id));
        return toDTO(rm);
    }

    @Transactional
    public RawMaterialDTO create(RawMaterialDTO dto) {
        if (rawMaterialRepository.findByCode(dto.getCode()).isPresent()) {
            throw new ConflictException("Raw material code already exists: " + dto.getCode());
        }
        RawMaterial entity = toEntity(dto);
        rawMaterialRepository.persist(entity);
        return toDTO(entity);
    }

    @Transactional
    public RawMaterialDTO update(Long id, RawMaterialDTO dto) {
        RawMaterial rm = rawMaterialRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + id));
        if (rawMaterialRepository.findByCodeExcludingId(dto.getCode(), id).isPresent()) {
            throw new ConflictException("Raw material code already exists: " + dto.getCode());
        }
        rm.setCode(dto.getCode());
        rm.setName(dto.getName());
        rm.setStockQuantity(dto.getStockQuantity());
        rawMaterialRepository.persist(rm);
        return toDTO(rm);
    }

    @Transactional
    public void delete(Long id) {
        if (!rawMaterialRepository.deleteById(id)) {
            throw new NotFoundException("Raw material not found: " + id);
        }
    }

    private RawMaterial toEntity(RawMaterialDTO dto) {
        RawMaterial rm = new RawMaterial();
        rm.setId(dto.getId());
        rm.setCode(dto.getCode());
        rm.setName(dto.getName());
        rm.setStockQuantity(dto.getStockQuantity());
        return rm;
    }

    private RawMaterialDTO toDTO(RawMaterial rm) {
        RawMaterialDTO dto = new RawMaterialDTO();
        dto.setId(rm.getId());
        dto.setCode(rm.getCode());
        dto.setName(rm.getName());
        dto.setStockQuantity(rm.getStockQuantity());
        return dto;
    }
}
