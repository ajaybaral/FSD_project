package com.example.Participation.Service;

import com.example.Participation.DTO.UserDTO;
import com.example.Participation.Entity.RegisteredUser;
import com.example.Participation.Repository.RegisteredUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(UserIntegrationService.class);

    @Autowired
    private RegisteredUserRepository registeredUserRepository;

    /**
     * Handle user registration notification from registration service
     */
    public void handleUserRegistrationNotification(UserDTO userDTO) {
        try {
            // Check if user already exists
            Optional<RegisteredUser> existingUser = registeredUserRepository.findByEmail(userDTO.getEmail());

            if (existingUser.isPresent()) {
                // Update existing user
                RegisteredUser user = existingUser.get();
                user.setName(userDTO.getName());
                user.setClgName(userDTO.getClgName());
                user.setPhoneNo(userDTO.getPhoneNo());
                user.setRoles(userDTO.getRoles());
                user.setLastUpdated(LocalDateTime.now());

                registeredUserRepository.save(user);
                logger.info("Updated existing user in participation service: {}", userDTO.getEmail());
            } else {
                // Create new user
                RegisteredUser newUser = new RegisteredUser(
                        userDTO.getUserId(),
                        userDTO.getName(),
                        userDTO.getClgName(),
                        userDTO.getEmail(),
                        userDTO.getPhoneNo(),
                        userDTO.getRoles(),
                        userDTO.getDate());

                registeredUserRepository.save(newUser);
                logger.info("Created new user in participation service: {}", userDTO.getEmail());
            }

        } catch (Exception e) {
            logger.error("Error handling user registration notification: {}", e.getMessage());
            throw new RuntimeException("Failed to process user registration notification", e);
        }
    }

    /**
     * Get registered user by email
     */
    public RegisteredUser getRegisteredUserByEmail(String email) {
        return registeredUserRepository.findByEmail(email).orElse(null);
    }

    /**
     * Check if user is registered
     */
    public boolean isUserRegistered(String email) {
        return registeredUserRepository.existsByEmail(email);
    }
}