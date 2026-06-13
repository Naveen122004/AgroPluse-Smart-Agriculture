package com.agropulse.dto.response;

import java.time.LocalDateTime;

public class DiseaseAlertResponse {

    private Long id;
    private String diseaseName;
    private String cropAffected;
    private String category;
    private String symptoms;
    private String causes;
    private String prevention;
    private String treatment;
    private String severity;
    private Boolean active;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }
    public String getCropAffected() { return cropAffected; }
    public void setCropAffected(String cropAffected) { this.cropAffected = cropAffected; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getCauses() { return causes; }
    public void setCauses(String causes) { this.causes = causes; }
    public String getPrevention() { return prevention; }
    public void setPrevention(String prevention) { this.prevention = prevention; }
    public String getTreatment() { return treatment; }
    public void setTreatment(String treatment) { this.treatment = treatment; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
