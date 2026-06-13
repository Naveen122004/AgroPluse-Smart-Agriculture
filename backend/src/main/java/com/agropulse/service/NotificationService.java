package com.agropulse.service;

import com.agropulse.dto.response.NotificationResponse;
import com.agropulse.exception.ResourceNotFoundException;
import com.agropulse.model.Notification;
import com.agropulse.model.User;
import com.agropulse.repository.NotificationRepository;
import com.agropulse.security.CustomUserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CustomUserDetailsService userDetailsService;

    public NotificationService(
            NotificationRepository notificationRepository,
            CustomUserDetailsService userDetailsService) {
        this.notificationRepository = notificationRepository;
        this.userDetailsService = userDetailsService;
    }

    public List<NotificationResponse> getNotifications(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationResponse markAsRead(String email, Long notificationId) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found with id: " + notificationId);
        }

        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(user.getId());
        for (Notification notification : unread) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void createNotification(User user, String type, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setIsRead(notification.getIsRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
