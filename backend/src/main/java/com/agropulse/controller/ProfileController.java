package com.agropulse.controller;

import com.agropulse.dto.request.ChangePasswordRequest;
import com.agropulse.dto.request.ProfileUpdateRequest;
import com.agropulse.dto.response.ProfileResponse;
import com.agropulse.service.ProfileService;
import com.agropulse.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(Authentication authentication) {
        ProfileResponse response = profileService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        ProfileResponse response = profileService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/photo")
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadPhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        ProfileResponse response = profileService.uploadPhoto(authentication.getName(), file);
        return ResponseEntity.ok(ApiResponse.success("Profile photo uploaded successfully", response));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
