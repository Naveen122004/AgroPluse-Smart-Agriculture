package com.agropulse.controller;

import com.agropulse.dto.response.MarketPriceResponse;
import com.agropulse.dto.response.PageResponse;
import com.agropulse.service.MarketService;
import com.agropulse.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/market/prices")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<MarketPriceResponse>>> getAllPrices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "priceDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PageResponse<MarketPriceResponse> response = marketService.getAllPrices(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<MarketPriceResponse>>> searchByCrop(
            @RequestParam String crop,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "avgPrice") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PageResponse<MarketPriceResponse> response = marketService.searchByCrop(crop, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<MarketPriceResponse>>> filterPrices(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        List<MarketPriceResponse> response = marketService.filterPrices(state, district);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPriceTrends(@RequestParam String crop) {
        List<Map<String, Object>> trends = marketService.getPriceTrends(crop);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWeeklyComparison(@RequestParam String crop) {
        List<Map<String, Object>> comparison = marketService.getWeeklyComparison(crop);
        return ResponseEntity.ok(ApiResponse.success(comparison));
    }
}
