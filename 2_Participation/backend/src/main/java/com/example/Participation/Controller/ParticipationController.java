package com.example.Participation.Controller;

import org.springframework.web.bind.annotation.*;
import com.example.Participation.Repository.ParticipationRepository;
import com.example.Participation.Entity.Participation;
import com.example.Participation.DTO.UserDTO;
import com.example.Participation.Service.AuthenticationService;
import com.example.Participation.Service.UserIntegrationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class ParticipationController {

    private static final Logger logger = LoggerFactory.getLogger(ParticipationController.class);

    @Autowired
    private ParticipationRepository participationRepo;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserIntegrationService userIntegrationService;

    @GetMapping("/data")
    public ResponseEntity<Object> getAllParticipationData() {
        logger.info("Fetching all participation data...");
        try {
            List<Participation> participationList = participationRepo.findAll();
            if (participationList.isEmpty()) {
                logger.warn("No participation records found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No participation records found.");
            }
            logger.info("Successfully fetched participation data.");
            return ResponseEntity.ok(participationList);

        } catch (Exception e) {
            logger.error("Error occurred while fetching participation data.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching data.");
        }
    }

    @GetMapping("/user/{username}/participated-events")
    public ResponseEntity<Object> getParticipatedEvents(@PathVariable String username) {
        try {
            // Get all participation records for the user
            List<Participation> participations = participationRepo.findByUsername(username);

            if (participations.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No participated events found.");
            }

            // Extract the event names from the participation records
            List<String> events = participations.stream().map(Participation::geteventName).collect(Collectors.toList());

            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error fetching participated events.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching participated events.");
        }
    }

    @GetMapping("/data/{p_id}")
    public ResponseEntity<Object> getParticipationById(@PathVariable Long p_id) {
        logger.info("Fetching participation with ID: {}", p_id);
        try {
            Optional<Participation> participation = participationRepo.findById(p_id);

            if (participation.isPresent()) {
                logger.info("Found participation for ID: {}", p_id);
                return ResponseEntity.ok(participation.get());
            } else {
                logger.warn("No participation found with ID: {}", p_id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No participation found with ID: " + p_id);
            }
        } catch (Exception e) {
            logger.error("Error fetching participation by ID.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching participation by ID.");
        }
    }

    @GetMapping("/medical-conditions")
    public ResponseEntity<Object> getAllMedicalConditions() {
        logger.info("Fetching all unique medical conditions...");
        try {
            List<String> medicalConditions = participationRepo.findAll()
                    .stream()
                    .map(Participation::getmedicalCondition)
                    .distinct()
                    .collect(Collectors.toList());

            if (medicalConditions.isEmpty()) {
                logger.warn("No medical conditions found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No medical conditions found.");
            }
            logger.info("Found {} unique medical conditions.", medicalConditions.size());
            return ResponseEntity.ok(medicalConditions);

        } catch (Exception e) {
            logger.error("Error fetching medical conditions.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching medical conditions.");
        }
    }

    @PutMapping("/update/{p_id}")
    public ResponseEntity<Object> updateParticipation(@PathVariable Long p_id,
            @RequestBody Participation updatedParticipation) {
        logger.info("Updating participation with ID: {}", p_id);
        try {
            Optional<Participation> existingParticipation = participationRepo.findById(p_id);

            if (existingParticipation.isPresent()) {
                Participation participation = existingParticipation.get();

                // Manually map eventName to event and medicalCondition to medCond
                participation.seteventName(updatedParticipation.geteventName());
                participation.setmedicalCondition(updatedParticipation.getmedicalCondition());

                // Update other fields
                participation.setReferralSource(updatedParticipation.getReferralSource());
                participation.setDepartment(updatedParticipation.getDepartment());
                participation.setGender(updatedParticipation.getGender());
                participation.setType(updatedParticipation.getType());
                participation.setAge(updatedParticipation.getAge());

                participationRepo.save(participation);

                logger.info("Updated participation with ID: {}", p_id);

                // Return a JSON response
                Map<String, String> response = new HashMap<>();
                response.put("message", "Participation with ID " + p_id + " updated successfully.");
                return ResponseEntity.ok(response); // Return JSON response
            } else {
                logger.warn("No participation found with ID: {}", p_id);
                Map<String, String> response = new HashMap<>();
                response.put("error", "No participation found with ID: " + p_id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // Return JSON response
            }

        } catch (Exception e) {
            logger.error("Error updating participation.", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error updating participation.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return JSON response
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addParticipant(@RequestBody Participation newParticipation,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        logger.info("Adding a new participant...");
        try {
            // Validate authentication if token is provided
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                UserDTO user = authenticationService.validateTokenAndGetUser(token);
                if (user != null) {
                    // Set username from authenticated user
                    newParticipation.setUsername(user.getEmail());
                    logger.info("Authenticated user {} is adding participation", user.getEmail());
                }
            }

            participationRepo.save(newParticipation);
            logger.info("New participant added successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body("New participant added successfully.");
        } catch (Exception e) {
            logger.error("Error adding new participant.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding new participant.");
        }
    }

    @DeleteMapping("/delete/{p_id}")
    public ResponseEntity<Object> deleteParticipant(@PathVariable Long p_id) {
        logger.info("Deleting participant with ID: {}", p_id);
        try {
            Optional<Participation> participation = participationRepo.findById(p_id);

            if (participation.isPresent()) {
                participationRepo.delete(participation.get());
                logger.info("Deleted participant with ID: {}", p_id);
                return ResponseEntity.ok("Participant with ID " + p_id + " deleted successfully.");
            } else {
                logger.warn("No participant found with ID: {}", p_id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No participant found with ID: " + p_id);
            }

        } catch (Exception e) {
            logger.error("Error deleting participant.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting participant.");
        }
    }
}
