package com.agropulse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "AgroPulse Password Reset OTP";
        String body = "Your OTP for password reset is: " + otp + "\n\n"
                + "This OTP is valid for 10 minutes. Do not share it with anyone.";

        if (!mailEnabled || fromEmail == null || fromEmail.isBlank()) {
            log.info("Mail disabled. OTP for {}: {}", toEmail, otp);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendContactNotification(String name, String email, String subject, String messageText) {
        if (!mailEnabled || fromEmail == null || fromEmail.isBlank()) {
            log.info("Contact inquiry from {} ({}): {}", name, email, subject);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(fromEmail);
        message.setSubject("AgroPulse Contact: " + subject);
        message.setText("From: " + name + " (" + email + ")\n\n" + messageText);
        mailSender.send(message);
    }
}
