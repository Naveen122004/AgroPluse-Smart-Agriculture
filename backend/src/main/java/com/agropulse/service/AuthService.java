package com.agropulse.service;

import com.agropulse.dto.request.*;
import com.agropulse.dto.response.AuthResponse;
import com.agropulse.dto.response.UserResponse;
import com.agropulse.exception.BadRequestException;
import com.agropulse.exception.ResourceNotFoundException;
import com.agropulse.model.PasswordResetOtp;
import com.agropulse.model.Profile;
import com.agropulse.model.User;
import com.agropulse.repository.PasswordResetOtpRepository;
import com.agropulse.repository.ProfileRepository;
import com.agropulse.repository.UserRepository;
import com.agropulse.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            PasswordResetOtpRepository otpRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            EmailService emailService,
            ActivityService activityService,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail().toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().toLowerCase(Locale.ROOT).trim());
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(user);
        profileRepository.save(profile);
        user.setProfile(profile);

        activityService.logActivity(user, "AUTH", "Account created successfully");
        notificationService.createNotification(user, "SCHEME", "Welcome to AgroPulse!",
                "Complete your profile to get personalized weather and crop recommendations.");
        notificationService.createNotification(user, "WEATHER", "Weather Alerts Enabled",
                "Check the Weather module for 7-day forecasts in your area.");

        String token = jwtTokenProvider.generateToken(user.getEmail(), false);
        return new AuthResponse(token, toUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(Locale.ROOT).trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        activityService.logActivity(user, "AUTH", "Logged in successfully");

        String token = jwtTokenProvider.generateToken(authentication, request.isRememberMe());
        return new AuthResponse(token, toUserResponse(user));
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase(Locale.ROOT).trim();
        if (!userRepository.existsByEmail(email)) {
            return;
        }

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));

        PasswordResetOtp resetOtp = new PasswordResetOtp();
        resetOtp.setEmail(email);
        resetOtp.setOtp(otp);
        resetOtp.setUsed(false);
        resetOtp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpRepository.save(resetOtp);

        emailService.sendOtpEmail(email, otp);
    }

    public void verifyOtp(VerifyOtpRequest request) {
        validateOtp(request.getEmail(), request.getOtp());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        PasswordResetOtp resetOtp = validateOtp(request.getEmail(), request.getOtp());

        User user = userRepository.findByEmail(request.getEmail().toLowerCase(Locale.ROOT).trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetOtp.setUsed(true);
        otpRepository.save(resetOtp);

        activityService.logActivity(user, "AUTH", "Password reset successfully");
    }

    private PasswordResetOtp validateOtp(String email, String otp) {
        PasswordResetOtp resetOtp = otpRepository
                .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email.toLowerCase(Locale.ROOT).trim())
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        if (resetOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }
        if (!resetOtp.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP");
        }
        return resetOtp;
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone());
    }
}
