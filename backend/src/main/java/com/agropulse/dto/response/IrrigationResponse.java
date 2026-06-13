package com.agropulse.dto.response;

import java.time.LocalDateTime;

public class IrrigationResponse {

    private Long id;
    private String cropType;
    private String soilType;
    private String weatherCondition;
    private String waterRequirement;
    private String recommendedTime;
    private String irrigationFrequency;
    private String recommendation;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }
    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }
    public String getWaterRequirement() { return waterRequirement; }
    public void setWaterRequirement(String waterRequirement) { this.waterRequirement = waterRequirement; }
    public String getRecommendedTime() { return recommendedTime; }
    public void setRecommendedTime(String recommendedTime) { this.recommendedTime = recommendedTime; }
    public String getIrrigationFrequency() { return irrigationFrequency; }
    public void setIrrigationFrequency(String irrigationFrequency) { this.irrigationFrequency = irrigationFrequency; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
