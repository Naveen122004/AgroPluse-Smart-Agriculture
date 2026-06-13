package com.agropulse.controller;

import com.agropulse.dto.request.ChatMessageRequest;
import com.agropulse.dto.response.ChatMessageResponse;
import com.agropulse.dto.response.ChatResponse;
import com.agropulse.service.ChatbotService;
import com.agropulse.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            Authentication authentication,
            @Valid @RequestBody ChatMessageRequest request) {
        ChatResponse response = chatbotService.sendMessage(authentication.getName(), request.getMessage());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getHistory(Authentication authentication) {
        List<ChatMessageResponse> history = chatbotService.getHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(Authentication authentication) {
        List<String> suggestions = chatbotService.getSuggestions(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }
}
