package com.agropulse.service;

import com.agropulse.dto.response.RecentActivityResponse;
import com.agropulse.model.RecentActivity;
import com.agropulse.model.User;
import com.agropulse.repository.RecentActivityRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final RecentActivityRepository recentActivityRepository;

    public ActivityService(RecentActivityRepository recentActivityRepository) {
        this.recentActivityRepository = recentActivityRepository;
    }

    @Transactional
    public void logActivity(User user, String activityType, String description) {
        RecentActivity activity = new RecentActivity();
        activity.setUser(user);
        activity.setActivityType(activityType);
        activity.setDescription(description);
        recentActivityRepository.save(activity);
    }

    public List<RecentActivityResponse> getRecentActivities(Long userId) {
        return recentActivityRepository
                .findTop10ByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 10))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private RecentActivityResponse toResponse(RecentActivity activity) {
        return new RecentActivityResponse(
                activity.getId(),
                activity.getActivityType(),
                activity.getDescription(),
                activity.getCreatedAt()
        );
    }
}
