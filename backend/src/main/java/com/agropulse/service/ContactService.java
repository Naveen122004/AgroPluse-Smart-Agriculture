package com.agropulse.service;

import com.agropulse.dto.request.ContactRequest;
import com.agropulse.model.ContactInquiry;
import com.agropulse.repository.ContactInquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactInquiryRepository contactInquiryRepository;
    private final EmailService emailService;

    public ContactService(ContactInquiryRepository contactInquiryRepository, EmailService emailService) {
        this.contactInquiryRepository = contactInquiryRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void submitInquiry(ContactRequest request) {
        ContactInquiry inquiry = new ContactInquiry();
        inquiry.setName(request.getName().trim());
        inquiry.setEmail(request.getEmail().trim());
        inquiry.setSubject(request.getSubject().trim());
        inquiry.setMessage(request.getMessage().trim());
        contactInquiryRepository.save(inquiry);

        emailService.sendContactNotification(
                inquiry.getName(), inquiry.getEmail(), inquiry.getSubject(), inquiry.getMessage());
    }
}
