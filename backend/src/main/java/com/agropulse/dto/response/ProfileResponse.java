package com.agropulse.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProfileResponse {

    private Long id;
    private UserResponse user;
    private String profilePhoto;
    private String address;
    private String state;
    private String district;
    private String preferredCrop;
    private BigDecimal farmSize;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getPreferredCrop() { return preferredCrop; }
    public void setPreferredCrop(String preferredCrop) { this.preferredCrop = preferredCrop; }
    public BigDecimal getFarmSize() { return farmSize; }
    public void setFarmSize(BigDecimal farmSize) { this.farmSize = farmSize; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
