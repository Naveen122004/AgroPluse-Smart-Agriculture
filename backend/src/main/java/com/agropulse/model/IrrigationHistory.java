package com.agropulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "irrigation_history")
public class IrrigationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "crop_type", nullable = false, length = 50)
    private String cropType;

    @Column(name = "soil_type", nullable = false, length = 50)
    private String soilType;

    @Column(name = "weather_condition", nullable = false, length = 50)
    private String weatherCondition;

    @Column(name = "water_requirement", nullable = false, length = 100)
    private String waterRequirement;

    @Column(name = "recommended_time", nullable = false, length = 100)
    private String recommendedTime;

    @Column(name = "irrigation_frequency", nullable = false, length = 100)
    private String irrigationFrequency;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String recommendation;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
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
