package com.example.Participation.Controller;

import com.example.Participation.DTO.UserDTO;
import com.example.Participation.Service.UserIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4201" })
public class UserIntegrationController {

    private static final Logger logger = LoggerFactory.getLogger(UserIntegrationController.class);

    @Autowired
    private UserIntegrationService userIntegrationService;

    /**
     * Receive user registration notification from registration service
     */
    @PostMapping("/register-notification")
    public ResponseEntity<?> handleUserRegistrationNotification(@RequestBody UserDTO userDTO) {
        try {
            logger.info("Received user registration notification for: {}", userDTO.getEmail());

            userIntegrationService.handleUserRegistrationNotification(userDTO);

            return ResponseEntity.ok(Map.of(
                    "message", "User registration notification processed successfully",
                    "email", userDTO.getEmail()));

        } catch (Exception e) {
            logger.error("Error processing user registration notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process user registration notification"));
        }
    }

    /**
     * Check if user is registered in participation service
     */
    @GetMapping("/check-registration/{email}")
    public ResponseEntity<?> checkUserRegistration(@PathVariable String email) {
        try {
            boolean isRegistered = userIntegrationService.isUserRegistered(email);

            return ResponseEntity.ok(Map.of(
                    "email", email,
                    "registered", isRegistered));

        } catch (Exception e) {
            logger.error("Error checking user registration: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to check user registration"));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "participation-service",
                "timestamp", System.currentTimeMillis()));
    }
}