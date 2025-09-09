package com.fsd1.group_project.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Client to communicate with Participation service for participant validation.
 */
@Service
public class ParticipationClient {

    private final RestTemplate restTemplate;
    private final String participationServiceBaseUrl;

    public ParticipationClient(RestTemplate restTemplate,
                               @Value("${services.participation.url:http://localhost:8082}") String participationServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.participationServiceBaseUrl = participationServiceBaseUrl;
    }

    /**
     * Validate that a participation record exists for the provided id.
     * Returns true if HTTP 200 and body is not null.
     */
    public boolean doesParticipationExistById(String participationId) {
        try {
            String url = participationServiceBaseUrl + "/data/" + participationId;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful() && response.getBody() != null;
        } catch (Exception ex) {
            return false;
        }
    }
}


