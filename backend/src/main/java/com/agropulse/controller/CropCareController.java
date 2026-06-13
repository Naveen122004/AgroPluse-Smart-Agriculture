package com.agropulse.controller;

import com.agropulse.dto.response.CropAdvisoryResponse;
import com.agropulse.service.CropCareService;
import com.agropulse.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/crop-care")
public class CropCareController {

    private final CropCareService cropCareService;

    public CropCareController(CropCareService cropCareService) {
        this.cropCareService = cropCareService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CropAdvisoryResponse>>> getAllAdvisories() {
        return ResponseEntity.ok(ApiResponse.success(cropCareService.getAllAdvisories()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CropAdvisoryResponse>>> searchAdvisories(@RequestParam("q") String query) {
        return ResponseEntity.ok(ApiResponse.success(cropCareService.searchAdvisories(query)));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<CropAdvisoryResponse>>> filterAdvisories(
            @RequestParam(required = false) String crop,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(cropCareService.filterAdvisories(crop, category)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CropAdvisoryResponse>> getAdvisoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(cropCareService.getAdvisoryById(id)));
    }

    @GetMapping("/tip-of-day")
    public ResponseEntity<ApiResponse<CropAdvisoryResponse>> getTipOfDay() {
        return ResponseEntity.ok(ApiResponse.success(cropCareService.getTipOfDay()));
    }
}
