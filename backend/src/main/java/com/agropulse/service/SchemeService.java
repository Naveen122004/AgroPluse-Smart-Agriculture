package com.agropulse.service;

import com.agropulse.dto.response.GovernmentSchemeResponse;
import com.agropulse.exception.BadRequestException;
import com.agropulse.exception.ResourceNotFoundException;
import com.agropulse.model.GovernmentScheme;
import com.agropulse.model.SavedScheme;
import com.agropulse.model.User;
import com.agropulse.repository.GovernmentSchemeRepository;
import com.agropulse.repository.SavedSchemeRepository;
import com.agropulse.security.CustomUserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeService {

    private final GovernmentSchemeRepository schemeRepository;
    private final SavedSchemeRepository savedSchemeRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ActivityService activityService;
    private final SchemeSyncService schemeSyncService;

    public SchemeService(
            GovernmentSchemeRepository schemeRepository,
            SavedSchemeRepository savedSchemeRepository,
            CustomUserDetailsService userDetailsService,
            ActivityService activityService,
            SchemeSyncService schemeSyncService) {
        this.schemeRepository = schemeRepository;
        this.savedSchemeRepository = savedSchemeRepository;
        this.userDetailsService = userDetailsService;
        this.activityService = activityService;
        this.schemeSyncService = schemeSyncService;
    }

    public List<GovernmentSchemeResponse> getAllSchemes(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return schemeRepository.findByActiveTrueOrderByPublishDateDesc().stream()
                .map(scheme -> toResponse(scheme, isSaved(user.getId(), scheme.getId())))
                .collect(Collectors.toList());
    }

    public List<GovernmentSchemeResponse> getLatestSchemes(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return schemeRepository.findTop5ByActiveTrueOrderByPublishDateDesc().stream()
                .map(scheme -> toResponse(scheme, isSaved(user.getId(), scheme.getId())))
                .collect(Collectors.toList());
    }

    public List<GovernmentSchemeResponse> getNewSchemes(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return schemeRepository.findByActiveTrueAndPublishDateAfterOrderByPublishDateDesc(thirtyDaysAgo).stream()
                .map(scheme -> toResponse(scheme, isSaved(user.getId(), scheme.getId())))
                .collect(Collectors.toList());
    }

    public List<GovernmentSchemeResponse> searchSchemes(String email, String query) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return schemeRepository.searchActiveByKeyword(query).stream()
                .map(scheme -> toResponse(scheme, isSaved(user.getId(), scheme.getId())))
                .collect(Collectors.toList());
    }

    public List<GovernmentSchemeResponse> filterByState(String email, String state) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        List<GovernmentScheme> schemes = schemeRepository.findByActiveTrueAndStateIgnoreCase(state);
        schemes.addAll(schemeRepository.findByActiveTrueAndStateIgnoreCase("All India"));
        return schemes.stream()
                .distinct()
                .sorted((a, b) -> {
                    if (b.getPublishDate() == null) return -1;
                    if (a.getPublishDate() == null) return 1;
                    return b.getPublishDate().compareTo(a.getPublishDate());
                })
                .map(scheme -> toResponse(scheme, isSaved(user.getId(), scheme.getId())))
                .collect(Collectors.toList());
    }

    public List<GovernmentSchemeResponse> filterByCategory(String email, String category) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return schemeRepository.findByActiveTrueAndCategoryIgnoreCase(category).stream()
                .map(scheme -> toResponse(scheme, isSaved(user.getId(), scheme.getId())))
                .collect(Collectors.toList());
    }

    public List<String> getCategories() {
        return schemeRepository.findAllActiveCategories();
    }

    public List<String> getStates() {
        return schemeRepository.findAllActiveStates();
    }

    public GovernmentSchemeResponse getSchemeById(String email, Long id) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        GovernmentScheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));
        return toResponse(scheme, isSaved(user.getId(), scheme.getId()));
    }

    @Transactional
    public int triggerSync() {
        return schemeSyncService.syncSchemes();
    }

    @Transactional
    public GovernmentSchemeResponse saveScheme(String email, Long schemeId) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        GovernmentScheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + schemeId));

        if (savedSchemeRepository.existsByUserIdAndSchemeId(user.getId(), schemeId)) {
            throw new BadRequestException("Scheme is already saved");
        }

        SavedScheme savedScheme = new SavedScheme();
        savedScheme.setUser(user);
        savedScheme.setScheme(scheme);
        savedSchemeRepository.save(savedScheme);

        activityService.logActivity(user, "SCHEME", "Saved scheme: " + scheme.getSchemeName());
        return toResponse(scheme, true);
    }

    @Transactional
    public void unsaveScheme(String email, Long schemeId) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        SavedScheme savedScheme = savedSchemeRepository.findByUserIdAndSchemeId(user.getId(), schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved scheme not found"));
        savedSchemeRepository.delete(savedScheme);
        activityService.logActivity(user, "SCHEME", "Removed saved scheme");
    }

    public List<GovernmentSchemeResponse> getSavedSchemes(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return savedSchemeRepository.findByUserId(user.getId()).stream()
                .map(saved -> toResponse(saved.getScheme(), true))
                .collect(Collectors.toList());
    }

    private boolean isSaved(Long userId, Long schemeId) {
        return savedSchemeRepository.existsByUserIdAndSchemeId(userId, schemeId);
    }

    private GovernmentSchemeResponse toResponse(GovernmentScheme scheme, boolean saved) {
        GovernmentSchemeResponse r = new GovernmentSchemeResponse();
        r.setId(scheme.getId());
        r.setSchemeName(scheme.getSchemeName());
        r.setDescription(scheme.getDescription());
        r.setEligibility(scheme.getEligibility());
        r.setBenefits(scheme.getBenefits());
        r.setApplicationProcess(scheme.getApplicationProcess());
        r.setOfficialLink(scheme.getOfficialLink());
        r.setLastDate(scheme.getLastDate());
        r.setState(scheme.getState());
        r.setCategory(scheme.getCategory());
        r.setSource(scheme.getSource());
        r.setPublishDate(scheme.getPublishDate());
        r.setLastUpdated(scheme.getLastUpdated());
        r.setActive(scheme.getActive());
        r.setSaved(saved);
        r.setIsNew(scheme.isNew());
        r.setCreatedAt(scheme.getCreatedAt());
        return r;
    }
}
