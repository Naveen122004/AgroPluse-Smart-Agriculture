package com.agropulse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class IrrigationRequest {

    @NotBlank(message = "Crop type is required")
    @Size(max = 50, message = "Crop type must not exceed 50 characters")
    private String cropType;

    @NotBlank(message = "Soil type is required")
    @Size(max = 50, message = "Soil type must not exceed 50 characters")
    private String soilType;

    @NotBlank(message = "Weather condition is required")
    @Size(max = 50, message = "Weather condition must not exceed 50 characters")
    private String weatherCondition;

    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }
    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }
}
