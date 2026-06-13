package com.agropulse.controller;

import com.agropulse.dto.request.ContactRequest;
import com.agropulse.service.ContactService;
import com.agropulse.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitContact(@Valid @RequestBody ContactRequest request) {
        contactService.submitInquiry(request);
        return ResponseEntity.ok(ApiResponse.success("Your message has been submitted successfully", null));
    }
}
