package com.agropulse.controller;

import com.agropulse.dto.response.GovernmentSchemeResponse;
import com.agropulse.service.SchemeService;
import com.agropulse.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> getAllSchemes(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getAllSchemes(auth.getName())));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> getLatestSchemes(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getLatestSchemes(auth.getName())));
    }

    @GetMapping("/new")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> getNewSchemes(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getNewSchemes(auth.getName())));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> searchSchemes(
            Authentication auth, @RequestParam("q") String query) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.searchSchemes(auth.getName(), query)));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> filterByState(
            Authentication auth, @RequestParam String state) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.filterByState(auth.getName(), state)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> filterByCategory(
            Authentication auth, @PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.filterByCategory(auth.getName(), category)));
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> filterByStatePath(
            Authentication auth, @PathVariable String state) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.filterByState(auth.getName(), state)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getCategories()));
    }

    @GetMapping("/states")
    public ResponseEntity<ApiResponse<List<String>>> getStates() {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getStates()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GovernmentSchemeResponse>> getSchemeById(
            Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getSchemeById(auth.getName(), id)));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerSync(Authentication auth) {
        int added = schemeService.triggerSync();
        return ResponseEntity.ok(ApiResponse.success("Sync complete",
                Map.of("newSchemesAdded", added, "message",
                        added > 0 ? added + " new schemes added." : "All schemes are up to date.")));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<GovernmentSchemeResponse>> saveScheme(
            Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Scheme saved successfully",
                schemeService.saveScheme(auth.getName(), id)));
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Void>> unsaveScheme(
            Authentication auth, @PathVariable Long id) {
        schemeService.unsaveScheme(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Scheme removed from saved list", null));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeResponse>>> getSavedSchemes(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getSavedSchemes(auth.getName())));
    }
}
