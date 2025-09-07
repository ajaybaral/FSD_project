package com.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;

import java.time.Duration;

@Configuration
public class ServiceConfig {

    @Value("${services.registration.url:http://localhost:8081}")
    private String registrationServiceUrl;

    @Value("${services.participation.url:http://localhost:8082}")
    private String participationServiceUrl;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
    }

    public String getRegistrationServiceUrl() {
        return registrationServiceUrl;
    }

    public String getParticipationServiceUrl() {
        return participationServiceUrl;
    }
}