package com.agropulse.service;

import com.agropulse.dto.response.MarketPriceResponse;
import com.agropulse.dto.response.PageResponse;
import com.agropulse.model.MarketPrice;
import com.agropulse.repository.MarketPriceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MarketService {

    private final MarketPriceRepository marketPriceRepository;

    public MarketService(MarketPriceRepository marketPriceRepository) {
        this.marketPriceRepository = marketPriceRepository;
    }

    public PageResponse<MarketPriceResponse> getAllPrices(int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(resolveSortDirection(sortDir), resolveSortField(sortBy));
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MarketPrice> pricePage = marketPriceRepository.findAll(pageable);
        return toPageResponse(pricePage);
    }

    public PageResponse<MarketPriceResponse> searchByCrop(String crop, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(resolveSortDirection(sortDir), resolveSortField(sortBy));
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MarketPrice> pricePage = marketPriceRepository.findByCropNameContainingIgnoreCase(crop, pageable);
        return toPageResponse(pricePage);
    }

    public List<MarketPriceResponse> filterPrices(String state, String district) {
        List<MarketPrice> prices;
        if (state != null && !state.isBlank() && district != null && !district.isBlank()) {
            prices = marketPriceRepository.findByStateIgnoreCaseAndDistrictIgnoreCase(state, district);
        } else if (state != null && !state.isBlank()) {
            prices = marketPriceRepository.findByStateIgnoreCase(state);
        } else {
            prices = marketPriceRepository.findAll();
        }
        return prices.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPriceTrends(String crop) {
        List<MarketPrice> prices = marketPriceRepository.findByCropNameContainingIgnoreCase(crop).stream()
                .sorted(Comparator.comparing(MarketPrice::getPriceDate))
                .collect(Collectors.toList());

        List<Map<String, Object>> trends = new ArrayList<>();
        for (MarketPrice price : prices) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", price.getPriceDate());
            point.put("avgPrice", price.getAvgPrice());
            point.put("minPrice", price.getMinPrice());
            point.put("maxPrice", price.getMaxPrice());
            point.put("marketName", price.getMarketName());
            trends.add(point);
        }
        return trends;
    }

    public List<Map<String, Object>> getWeeklyComparison(String crop) {
        LocalDate weekStart = LocalDate.now().minusDays(7);
        List<MarketPrice> prices = marketPriceRepository.findByCropNameContainingIgnoreCase(crop).stream()
                .filter(p -> !p.getPriceDate().isBefore(weekStart))
                .sorted(Comparator.comparing(MarketPrice::getPriceDate))
                .collect(Collectors.toList());

        Map<String, List<BigDecimal>> byMarket = new HashMap<>();
        for (MarketPrice price : prices) {
            byMarket.computeIfAbsent(price.getMarketName(), k -> new ArrayList<>()).add(price.getAvgPrice());
        }

        List<Map<String, Object>> comparison = new ArrayList<>();
        for (Map.Entry<String, List<BigDecimal>> entry : byMarket.entrySet()) {
            List<BigDecimal> values = entry.getValue();
            BigDecimal avg = values.stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(values.size()), 2, java.math.RoundingMode.HALF_UP);
            Map<String, Object> row = new HashMap<>();
            row.put("marketName", entry.getKey());
            row.put("weeklyAvgPrice", avg);
            row.put("dataPoints", values.size());
            comparison.add(row);
        }
        return comparison;
    }

    private PageResponse<MarketPriceResponse> toPageResponse(Page<MarketPrice> page) {
        List<MarketPriceResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    private MarketPriceResponse toResponse(MarketPrice price) {
        MarketPriceResponse response = new MarketPriceResponse();
        response.setId(price.getId());
        response.setCropName(price.getCropName());
        response.setMarketName(price.getMarketName());
        response.setState(price.getState());
        response.setDistrict(price.getDistrict());
        response.setMinPrice(price.getMinPrice());
        response.setMaxPrice(price.getMaxPrice());
        response.setAvgPrice(price.getAvgPrice());
        response.setPriceDate(price.getPriceDate());
        response.setCreatedAt(price.getCreatedAt());
        return response;
    }

    private Sort.Direction resolveSortDirection(String sortDir) {
        return "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
    }

    private String resolveSortField(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "priceDate";
        }
        return switch (sortBy) {
            case "avgPrice", "minPrice", "maxPrice", "cropName", "priceDate" -> sortBy;
            default -> "priceDate";
        };
    }
}
