package com.agropulse.controller;

import com.agropulse.dto.response.WeatherResponse;
import com.agropulse.service.WeatherService;
import com.agropulse.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<WeatherResponse>> getCurrentWeather(
            Authentication authentication,
            @RequestParam String city) {
        WeatherResponse response = weatherService.getCurrentWeather(authentication.getName(), city);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/forecast")
    public ResponseEntity<ApiResponse<WeatherResponse>> getForecast(
            Authentication authentication,
            @RequestParam String city) {
        WeatherResponse response = weatherService.getForecast(authentication.getName(), city);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/location")
    public ResponseEntity<ApiResponse<WeatherResponse>> getWeatherByLocation(
            Authentication authentication,
            @RequestParam double lat,
            @RequestParam double lon) {
        WeatherResponse response = weatherService.getWeatherByLocation(authentication.getName(), lat, lon);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<WeatherResponse>>> getHistory(Authentication authentication) {
        List<WeatherResponse> history = weatherService.getHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
