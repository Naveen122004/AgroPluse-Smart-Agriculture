package com.agropulse.service;

import com.agropulse.dto.request.ChangePasswordRequest;
import com.agropulse.dto.request.ProfileUpdateRequest;
import com.agropulse.dto.response.ProfileResponse;
import com.agropulse.dto.response.UserResponse;
import com.agropulse.exception.BadRequestException;
import com.agropulse.exception.ResourceNotFoundException;
import com.agropulse.model.Profile;
import com.agropulse.model.User;
import com.agropulse.repository.ProfileRepository;
import com.agropulse.repository.UserRepository;
import com.agropulse.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;
    private final ActivityService activityService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public ProfileService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            CustomUserDetailsService userDetailsService,
            ActivityService activityService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.activityService = activityService;
    }

    public ProfileResponse getProfile(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        Profile profile = getOrCreateProfile(user);
        return toResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        Profile profile = getOrCreateProfile(user);

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        profile.setAddress(request.getAddress());
        profile.setState(request.getState());
        profile.setDistrict(request.getDistrict());
        profile.setPreferredCrop(request.getPreferredCrop());
        profile.setFarmSize(request.getFarmSize());

        userRepository.save(user);
        profileRepository.save(profile);
        activityService.logActivity(user, "PROFILE", "Profile updated");

        return toResponse(user, profile);
    }

    @Transactional
    public ProfileResponse uploadPhoto(String email, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Profile photo file is required");
        }

        User user = userDetailsService.loadUserEntityByEmail(email);
        Profile profile = getOrCreateProfile(user);

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".jpg";
        String filename = "profile_" + user.getId() + "_" + UUID.randomUUID() + extension;

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            profile.setProfilePhoto("/uploads/" + filename);
            profileRepository.save(profile);
            activityService.logActivity(user, "PROFILE", "Profile photo updated");
            return toResponse(user, profile);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to upload profile photo: " + ex.getMessage());
        }
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = userDetailsService.loadUserEntityByEmail(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        activityService.logActivity(user, "AUTH", "Password changed successfully");
    }

    private Profile getOrCreateProfile(User user) {
        return profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Profile profile = new Profile();
                    profile.setUser(user);
                    return profileRepository.save(profile);
                });
    }

    public Profile getProfileEntity(User user) {
        return getOrCreateProfile(user);
    }

    private ProfileResponse toResponse(User user, Profile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setUser(new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone()));
        response.setProfilePhoto(profile.getProfilePhoto());
        response.setAddress(profile.getAddress());
        response.setState(profile.getState());
        response.setDistrict(profile.getDistrict());
        response.setPreferredCrop(profile.getPreferredCrop());
        response.setFarmSize(profile.getFarmSize());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
