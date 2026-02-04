package com.sharego.service;

public interface EmailService {
    void sendSimpleEmail(String toEmail, String subject, String body);
}
