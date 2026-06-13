package com.agropulse.service;

import com.agropulse.dto.response.DashboardSummaryResponse;
import com.agropulse.dto.response.IrrigationResponse;
import com.agropulse.dto.response.MarketPriceResponse;
import com.agropulse.dto.response.RecentActivityResponse;
import com.agropulse.dto.response.WeatherResponse;
import com.agropulse.model.IrrigationHistory;
import com.agropulse.model.Profile;
import com.agropulse.model.User;
import com.agropulse.repository.IrrigationHistoryRepository;
import com.agropulse.repository.SavedSchemeRepository;
import com.agropulse.security.CustomUserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final CustomUserDetailsService userDetailsService;
    private final ProfileService profileService;
    private final WeatherService weatherService;
    private final MarketService marketService;
    private final CropCareService cropCareService;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    private final IrrigationHistoryRepository irrigationHistoryRepository;
    private final SavedSchemeRepository savedSchemeRepository;

    public DashboardService(
            CustomUserDetailsService userDetailsService,
            ProfileService profileService,
            WeatherService weatherService,
            MarketService marketService,
            CropCareService cropCareService,
            NotificationService notificationService,
            ActivityService activityService,
            IrrigationHistoryRepository irrigationHistoryRepository,
            SavedSchemeRepository savedSchemeRepository) {
        this.userDetailsService = userDetailsService;
        this.profileService = profileService;
        this.weatherService = weatherService;
        this.marketService = marketService;
        this.cropCareService = cropCareService;
        this.notificationService = notificationService;
        this.activityService = activityService;
        this.irrigationHistoryRepository = irrigationHistoryRepository;
        this.savedSchemeRepository = savedSchemeRepository;
    }

    public DashboardSummaryResponse getSummary(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        Profile profile = profileService.getProfileEntity(user);

        DashboardSummaryResponse summary = new DashboardSummaryResponse();

        String city = profile.getDistrict() != null && !profile.getDistrict().isBlank()
                ? profile.getDistrict()
                : (profile.getState() != null && !profile.getState().isBlank() ? profile.getState() : "Delhi");
        WeatherResponse weather = weatherService.fetchCurrentWeather(city);
        summary.setWeather(weather);

        String crop = profile.getPreferredCrop() != null && !profile.getPreferredCrop().isBlank()
                ? profile.getPreferredCrop()
                : "Wheat";
        List<MarketPriceResponse> marketPrices = marketService.searchByCrop(crop, 0, 1, "priceDate", "desc").getContent();
        if (!marketPrices.isEmpty()) {
            summary.setMarketHighlight(marketPrices.get(0));
        }

        List<IrrigationHistory> irrigationHistory =
                irrigationHistoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (!irrigationHistory.isEmpty()) {
            summary.setLatestIrrigation(mapIrrigation(irrigationHistory.get(0)));
        }

        summary.setCropTip(cropCareService.getTipOfDay());
        summary.setUnreadNotifications(notificationService.getUnreadCount(email));
        summary.setSavedSchemesCount(savedSchemeRepository.findByUserId(user.getId()).size());
        summary.setRecentActivities(activityService.getRecentActivities(user.getId()));

        return summary;
    }

    public List<RecentActivityResponse> getActivities(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return activityService.getRecentActivities(user.getId());
    }

    private IrrigationResponse mapIrrigation(IrrigationHistory history) {
        IrrigationResponse response = new IrrigationResponse();
        response.setId(history.getId());
        response.setCropType(history.getCropType());
        response.setSoilType(history.getSoilType());
        response.setWeatherCondition(history.getWeatherCondition());
        response.setWaterRequirement(history.getWaterRequirement());
        response.setRecommendedTime(history.getRecommendedTime());
        response.setIrrigationFrequency(history.getIrrigationFrequency());
        response.setRecommendation(history.getRecommendation());
        response.setCreatedAt(history.getCreatedAt());
        return response;
    }
}
