package com.agropulse.dto.response;

import java.time.LocalDateTime;

public class ChatMessageResponse {

    private Long id;
    private String sender;
    private String message;
    private LocalDateTime createdAt;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(Long id, String sender, String message, LocalDateTime createdAt) {
        this.id = id;
        this.sender = sender;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
