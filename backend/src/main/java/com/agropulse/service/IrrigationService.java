package com.agropulse.service;

import com.agropulse.dto.request.IrrigationRequest;
import com.agropulse.dto.response.IrrigationResponse;
import com.agropulse.model.IrrigationHistory;
import com.agropulse.model.User;
import com.agropulse.repository.IrrigationHistoryRepository;
import com.agropulse.security.CustomUserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class IrrigationService {

    private final IrrigationHistoryRepository irrigationHistoryRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ActivityService activityService;

    public IrrigationService(
            IrrigationHistoryRepository irrigationHistoryRepository,
            CustomUserDetailsService userDetailsService,
            ActivityService activityService) {
        this.irrigationHistoryRepository = irrigationHistoryRepository;
        this.userDetailsService = userDetailsService;
        this.activityService = activityService;
    }

    @Transactional
    public IrrigationResponse getRecommendation(String email, IrrigationRequest request) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        IrrigationResponse response = applyRules(request);

        IrrigationHistory history = new IrrigationHistory();
        history.setUser(user);
        history.setCropType(request.getCropType());
        history.setSoilType(request.getSoilType());
        history.setWeatherCondition(request.getWeatherCondition());
        history.setWaterRequirement(response.getWaterRequirement());
        history.setRecommendedTime(response.getRecommendedTime());
        history.setIrrigationFrequency(response.getIrrigationFrequency());
        history.setRecommendation(response.getRecommendation());
        history = irrigationHistoryRepository.save(history);

        response.setId(history.getId());
        response.setCropType(history.getCropType());
        response.setSoilType(history.getSoilType());
        response.setWeatherCondition(history.getWeatherCondition());
        response.setCreatedAt(history.getCreatedAt());

        activityService.logActivity(user, "IRRIGATION",
                "Irrigation advice for " + request.getCropType());

        return response;
    }

    public List<IrrigationResponse> getHistory(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return irrigationHistoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private IrrigationResponse applyRules(IrrigationRequest request) {
        String crop = request.getCropType().toLowerCase(Locale.ROOT);
        String soil = request.getSoilType().toLowerCase(Locale.ROOT);
        String weather = request.getWeatherCondition().toLowerCase(Locale.ROOT);

        String waterRequirement = "Moderate";
        String recommendedTime = "Early Morning (5-7 AM)";
        String irrigationFrequency = "Every 3 days";
        String recommendation = "Follow standard irrigation based on crop growth stage and soil moisture.";

        if (crop.contains("rice")) {
            waterRequirement = "High";
            irrigationFrequency = "Every 2-3 days";
            recommendation = "Maintain 5-7 cm standing water for rice paddies.";
            if (weather.contains("rain")) {
                waterRequirement = "Moderate";
                irrigationFrequency = "Every 4 days";
                recommendation = "Delay irrigation for 2 days due to expected rainfall.";
            } else if (weather.contains("hot") || weather.contains("sunny")) {
                recommendedTime = "Early Morning (5-6 AM) and Evening (6-7 PM)";
                irrigationFrequency = "Daily";
                recommendation = "Rice requires frequent irrigation in hot weather. Monitor field water level closely.";
            }
        } else if (crop.contains("wheat")) {
            waterRequirement = "Moderate";
            irrigationFrequency = "Every 5 days";
            recommendation = "Critical irrigation stages: crown root initiation, tillering, flowering, and grain filling.";
            if (weather.contains("rain")) {
                irrigationFrequency = "Every 7 days";
                recommendation = "Skip irrigation for 1 day due to rainfall. Avoid waterlogging in wheat fields.";
            } else if (weather.contains("hot") || weather.contains("dry")) {
                waterRequirement = "High";
                irrigationFrequency = "Every 4 days";
                recommendation = "Increase irrigation frequency during hot dry spells to protect yield.";
            }
        } else if (crop.contains("cotton")) {
            waterRequirement = "Moderate";
            irrigationFrequency = "Every 4 days";
            recommendation = "Avoid water stress during flowering and boll formation stages.";
            if (weather.contains("rain")) {
                recommendation = "Ensure proper drainage after rainfall to prevent root rot in cotton.";
            }
        } else if (crop.contains("sugarcane") || crop.contains("maize")) {
            waterRequirement = "High";
            irrigationFrequency = "Every 3 days";
            recommendation = "Deep irrigation recommended for deep-rooted crops during active growth.";
        }

        if (soil.contains("clay")) {
            if (!weather.contains("rain")) {
                irrigationFrequency = adjustFrequency(irrigationFrequency, 1);
            }
            recommendation = recommendation + " Clay soil retains moisture longer; avoid over-irrigation.";
        } else if (soil.contains("sandy")) {
            waterRequirement = "High";
            irrigationFrequency = adjustFrequency(irrigationFrequency, -1);
            recommendation = recommendation + " Sandy soil drains quickly; irrigate in smaller amounts more frequently.";
        } else if (soil.contains("loam")) {
            recommendation = recommendation + " Loam soil has good drainage; maintain consistent moisture.";
        }

        if (weather.contains("humid") && !weather.contains("rain")) {
            waterRequirement = "Low";
            recommendation = recommendation + " High humidity reduces evaporation; reduce irrigation volume.";
        }

        if (weather.contains("wind")) {
            recommendation = recommendation + " Windy conditions increase evaporation; monitor soil moisture closely.";
        }

        IrrigationResponse response = new IrrigationResponse();
        response.setWaterRequirement(waterRequirement);
        response.setRecommendedTime(recommendedTime);
        response.setIrrigationFrequency(irrigationFrequency);
        response.setRecommendation(recommendation.trim());
        return response;
    }

    private String adjustFrequency(String frequency, int dayDelta) {
        if (frequency.contains("Daily")) {
            return dayDelta > 0 ? "Every 2 days" : "Daily";
        }
        if (frequency.contains("Every 2-3 days")) {
            return dayDelta > 0 ? "Every 3-4 days" : "Every 2 days";
        }
        if (frequency.contains("Every 4 days")) {
            return dayDelta > 0 ? "Every 5 days" : "Every 3 days";
        }
        if (frequency.contains("Every 5 days")) {
            return dayDelta > 0 ? "Every 6 days" : "Every 4 days";
        }
        return frequency;
    }

    private IrrigationResponse toResponse(IrrigationHistory history) {
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
