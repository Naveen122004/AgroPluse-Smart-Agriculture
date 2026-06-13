package com.agropulse.controller;

import com.agropulse.dto.request.IrrigationRequest;
import com.agropulse.dto.response.IrrigationResponse;
import com.agropulse.service.IrrigationService;
import com.agropulse.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/irrigation")
public class IrrigationController {

    private final IrrigationService irrigationService;

    public IrrigationController(IrrigationService irrigationService) {
        this.irrigationService = irrigationService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<IrrigationResponse>> getRecommendation(
            Authentication authentication,
            @Valid @RequestBody IrrigationRequest request) {
        IrrigationResponse response = irrigationService.getRecommendation(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<IrrigationResponse>>> getHistory(Authentication authentication) {
        List<IrrigationResponse> history = irrigationService.getHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
