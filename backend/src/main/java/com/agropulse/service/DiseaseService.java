package com.agropulse.service;

import com.agropulse.dto.response.DiseaseAlertResponse;
import com.agropulse.exception.ResourceNotFoundException;
import com.agropulse.model.DiseaseAlert;
import com.agropulse.repository.DiseaseAlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiseaseService {

    private final DiseaseAlertRepository diseaseAlertRepository;

    public DiseaseService(DiseaseAlertRepository diseaseAlertRepository) {
        this.diseaseAlertRepository = diseaseAlertRepository;
    }

    public List<DiseaseAlertResponse> getActiveAlerts() {
        return diseaseAlertRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DiseaseAlertResponse> searchAlerts(String query) {
        return diseaseAlertRepository.searchActiveByKeyword(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DiseaseAlertResponse> filterAlerts(String crop, String category) {
        List<DiseaseAlert> alerts;
        if (crop != null && !crop.isBlank() && category != null && !category.isBlank()) {
            alerts = diseaseAlertRepository.findByActiveTrueAndCropAffectedIgnoreCaseAndCategoryIgnoreCase(crop, category);
        } else if (crop != null && !crop.isBlank()) {
            alerts = diseaseAlertRepository.findByActiveTrueAndCropAffectedIgnoreCase(crop);
        } else if (category != null && !category.isBlank()) {
            alerts = diseaseAlertRepository.findByActiveTrueAndCategoryIgnoreCase(category);
        } else {
            alerts = diseaseAlertRepository.findByActiveTrue();
        }
        return alerts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public DiseaseAlertResponse getAlertById(Long id) {
        DiseaseAlert alert = diseaseAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disease alert not found with id: " + id));
        return toResponse(alert);
    }

    private DiseaseAlertResponse toResponse(DiseaseAlert alert) {
        DiseaseAlertResponse response = new DiseaseAlertResponse();
        response.setId(alert.getId());
        response.setDiseaseName(alert.getDiseaseName());
        response.setCropAffected(alert.getCropAffected());
        response.setCategory(alert.getCategory());
        response.setSymptoms(alert.getSymptoms());
        response.setCauses(alert.getCauses());
        response.setPrevention(alert.getPrevention());
        response.setTreatment(alert.getTreatment());
        response.setSeverity(alert.getSeverity());
        response.setActive(alert.getActive());
        response.setCreatedAt(alert.getCreatedAt());
        return response;
    }
}
