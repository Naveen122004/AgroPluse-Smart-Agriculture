package com.agropulse.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "government_schemes", indexes = {
    @Index(name = "idx_scheme_state",    columnList = "state"),
    @Index(name = "idx_scheme_category", columnList = "category"),
    @Index(name = "idx_scheme_publish",  columnList = "publish_date"),
    @Index(name = "idx_scheme_name",     columnList = "scheme_name")
})
public class GovernmentScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheme_name", nullable = false, length = 200)
    private String schemeName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String eligibility;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "application_process", nullable = false, columnDefinition = "TEXT")
    private String applicationProcess;

    @Column(name = "official_link", length = 500)
    private String officialLink;

    @Column(name = "last_date")
    private LocalDate lastDate;

    @Column(length = 100)
    private String state = "All India";

    @Column(length = 100)
    private String category = "General";

    @Column(length = 200)
    private String source;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (publishDate == null) publishDate = LocalDate.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    public boolean isNew() {
        return publishDate != null && publishDate.isAfter(LocalDate.now().minusDays(30));
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSchemeName() { return schemeName; }
    public void setSchemeName(String schemeName) { this.schemeName = schemeName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public String getApplicationProcess() { return applicationProcess; }
    public void setApplicationProcess(String applicationProcess) { this.applicationProcess = applicationProcess; }
    public String getOfficialLink() { return officialLink; }
    public void setOfficialLink(String officialLink) { this.officialLink = officialLink; }
    public LocalDate getLastDate() { return lastDate; }
    public void setLastDate(LocalDate lastDate) { this.lastDate = lastDate; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public LocalDate getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDate publishDate) { this.publishDate = publishDate; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
