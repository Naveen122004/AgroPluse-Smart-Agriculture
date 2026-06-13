package com.agropulse.controller;

import com.agropulse.dto.response.DashboardSummaryResponse;
import com.agropulse.dto.response.RecentActivityResponse;
import com.agropulse.service.DashboardService;
import com.agropulse.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(Authentication authentication) {
        DashboardSummaryResponse summary = dashboardService.getSummary(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<RecentActivityResponse>>> getActivities(Authentication authentication) {
        List<RecentActivityResponse> activities = dashboardService.getActivities(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(activities));
    }
}
