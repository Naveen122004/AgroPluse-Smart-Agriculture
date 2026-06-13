package com.agropulse.service;

import com.agropulse.dto.response.CropAdvisoryResponse;
import com.agropulse.exception.ResourceNotFoundException;
import com.agropulse.model.CropAdvisory;
import com.agropulse.repository.CropAdvisoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CropCareService {

    private final CropAdvisoryRepository cropAdvisoryRepository;

    public CropCareService(CropAdvisoryRepository cropAdvisoryRepository) {
        this.cropAdvisoryRepository = cropAdvisoryRepository;
    }

    public List<CropAdvisoryResponse> getAllAdvisories() {
        return cropAdvisoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CropAdvisoryResponse> searchAdvisories(String query) {
        return cropAdvisoryRepository.searchByKeyword(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CropAdvisoryResponse> filterAdvisories(String crop, String category) {
        List<CropAdvisory> advisories;
        if (crop != null && !crop.isBlank() && category != null && !category.isBlank()) {
            advisories = cropAdvisoryRepository.findByCropNameIgnoreCaseAndCategoryIgnoreCase(crop, category);
        } else if (crop != null && !crop.isBlank()) {
            advisories = cropAdvisoryRepository.findByCropNameIgnoreCase(crop);
        } else if (category != null && !category.isBlank()) {
            advisories = cropAdvisoryRepository.findByCategoryIgnoreCase(category);
        } else {
            advisories = cropAdvisoryRepository.findAll();
        }
        return advisories.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CropAdvisoryResponse getAdvisoryById(Long id) {
        CropAdvisory advisory = cropAdvisoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop advisory not found with id: " + id));
        return toResponse(advisory);
    }

    public CropAdvisoryResponse getTipOfDay() {
        List<CropAdvisory> all = cropAdvisoryRepository.findAll();
        if (all.isEmpty()) {
            CropAdvisoryResponse fallback = new CropAdvisoryResponse();
            fallback.setTitle("Daily Farming Tip");
            fallback.setContent("Monitor soil moisture regularly and adjust irrigation based on weather forecasts.");
            fallback.setCategory("General");
            fallback.setCropName("All Crops");
            fallback.setSeason("All Season");
            return fallback;
        }
        int index = LocalDate.now().getDayOfYear() % all.size();
        return toResponse(all.get(index));
    }

    private CropAdvisoryResponse toResponse(CropAdvisory advisory) {
        CropAdvisoryResponse response = new CropAdvisoryResponse();
        response.setId(advisory.getId());
        response.setCropName(advisory.getCropName());
        response.setCategory(advisory.getCategory());
        response.setTitle(advisory.getTitle());
        response.setContent(advisory.getContent());
        response.setSeason(advisory.getSeason());
        response.setCreatedAt(advisory.getCreatedAt());
        return response;
    }
}
