package com.example.Participation.Controller;

import com.example.Participation.DTO.UserDTO;
import com.example.Participation.Service.AuthenticationService;
import com.example.Participation.Service.UserIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4201" })
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserIntegrationService userIntegrationService;

    /**
     * Validate token and authenticate user for participation service
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token is required"));
            }

            // Validate token with registration service
            UserDTO userDTO = authenticationService.validateTokenAndGetUser(token);

            if (userDTO == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }

            // Check if user is registered in participation service
            if (!userIntegrationService.isUserRegistered(userDTO.getEmail())) {
                // If not registered, create user record
                userIntegrationService.handleUserRegistrationNotification(userDTO);
            }

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "user", userDTO,
                    "message", "Token validated successfully"));

        } catch (Exception e) {
            logger.error("Error validating token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Token validation failed"));
        }
    }

    /**
     * Login endpoint that redirects to registration service
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .body(Map.of(
                        "message", "Please login through the registration service",
                        "redirectUrl", "http://localhost:8081/api/auth/login"));
    }
}