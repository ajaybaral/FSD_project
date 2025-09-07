package com.example.Participation.Service;

import com.example.Participation.Config.ServiceConfig;
import com.example.Participation.DTO.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ServiceConfig serviceConfig;

    /**
     * Validate token with registration service and get user information
     */
    public UserDTO validateTokenAndGetUser(String token) {
        try {
            String url = serviceConfig.getRegistrationServiceUrl() + "/api/integration/validate-token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = Map.of("token", token);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean valid = (Boolean) responseBody.get("valid");

                if (valid != null && valid) {
                    Map<String, Object> userMap = (Map<String, Object>) responseBody.get("user");
                    return mapToUserDTO(userMap);
                }
            }

            return null;

        } catch (Exception e) {
            logger.error("Error validating token with registration service: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Get user information by email from registration service
     */
    public UserDTO getUserByEmail(String email) {
        try {
            String url = serviceConfig.getRegistrationServiceUrl() + "/api/integration/user/" + email;

            ResponseEntity<UserDTO> response = restTemplate.getForEntity(url, UserDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }

            return null;

        } catch (Exception e) {
            logger.error("Error getting user by email from registration service: {}", e.getMessage());
            return null;
        }
    }

    private UserDTO mapToUserDTO(Map<String, Object> userMap) {
        UserDTO userDTO = new UserDTO();

        if (userMap.get("userId") != null) {
            userDTO.setUserId(Long.valueOf(userMap.get("userId").toString()));
        }
        userDTO.setName((String) userMap.get("name"));
        userDTO.setClgName((String) userMap.get("clgName"));
        userDTO.setEmail((String) userMap.get("email"));
        userDTO.setPhoneNo((String) userMap.get("phoneNo"));
        userDTO.setRoles((String) userMap.get("roles"));

        return userDTO;
    }
}