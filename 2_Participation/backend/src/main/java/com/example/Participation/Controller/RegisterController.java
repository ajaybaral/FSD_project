package com.example.Participation.Controller;

import org.springframework.web.bind.annotation.*;
import com.example.Participation.Repository.RegisterRepository;
import com.example.Participation.Entity.Register;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;  // Ensure this is imported
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/register")
public class RegisterController {

    private static final Logger logger = LoggerFactory.getLogger(RegisterController.class);

    @Autowired
    private RegisterRepository registerRepo;  // The instance of the RegisterRepository

    // Get all users
    @GetMapping("/all")
    public ResponseEntity<Object> getAllUsers() {
        logger.info("Fetching all users...");
        try {
            List<Register> userList = registerRepo.findAll();  // Correct usage
            if (userList.isEmpty()) {
                logger.warn("No users found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No users found.");
            }
            logger.info("Successfully fetched all users.");
            return ResponseEntity.ok(userList);

        } catch (Exception e) {
            logger.error("Error occurred while fetching users.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching users.");
        }
    }

    // Get user by username
    @GetMapping("/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable String username) {
        logger.info("Fetching user with username: {}", username);
        try {
            Optional<Register> user = registerRepo.findByUsername(username);  // Correct usage
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                logger.warn("No user found with username: {}", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with username: " + username);
            }
        } catch (Exception e) {
            logger.error("Error occurred while fetching user by username.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching user by username.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Register userCredentials) {
        logger.info("Received login request with username: {}, password: {}", userCredentials.getUsername(), userCredentials.getPassword());
        try {
            Optional<Register> user = registerRepo.findByUsername(userCredentials.getUsername());
            if (user.isPresent()) {
                // Log the stored password for comparison
                logger.info("Stored password: {}", user.get().getPassword());
    
                if (user.get().getPassword().equals(userCredentials.getPassword())) {
                    String token = "dummy-token-for-now";
    
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("user", user.get());
    
                    return ResponseEntity.ok(response);
                } else {
                    logger.warn("Password mismatch for username: {}", userCredentials.getUsername());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
                }
            } else {
                logger.warn("No user found with username: {}", userCredentials.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with username: " + userCredentials.getUsername());
            }
        } catch (Exception e) {
            logger.error("Error during login attempt.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login attempt.");
        }
    }
    

}
