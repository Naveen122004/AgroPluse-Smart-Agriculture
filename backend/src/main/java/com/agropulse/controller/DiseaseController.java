package com.agropulse.controller;

import com.agropulse.dto.response.DiseaseAlertResponse;
import com.agropulse.service.DiseaseService;
import com.agropulse.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diseases")
public class DiseaseController {

    private final DiseaseService diseaseService;

    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DiseaseAlertResponse>>> getActiveAlerts() {
        return ResponseEntity.ok(ApiResponse.success(diseaseService.getActiveAlerts()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DiseaseAlertResponse>>> searchAlerts(@RequestParam("q") String query) {
        return ResponseEntity.ok(ApiResponse.success(diseaseService.searchAlerts(query)));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<DiseaseAlertResponse>>> filterAlerts(
            @RequestParam(required = false) String crop,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(diseaseService.filterAlerts(crop, category)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DiseaseAlertResponse>> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(diseaseService.getAlertById(id)));
    }
}
