package com.fsd1.group_project.Controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsd1.group_project.Entity.Result;
import com.fsd1.group_project.Exception.ResourceNotFoundException;
import com.fsd1.group_project.Service.ResultService;

@RestController
@RequestMapping("/api/results")
public class ResultController {
    private static final Logger logger = LoggerFactory.getLogger(ResultController.class);

    @Autowired
    private ResultService resultService;

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {
        logger.info("Fetching all results");
        try {
            List<Result> results = resultService.findAll();
            logger.info("Found {} results", results.size());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Error fetching results: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable Long id) {
        logger.info("Fetching result with id: {}", id);
        Result result = resultService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
        logger.info("Found result with id: {}", id);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Result> createResult(@RequestBody Result result) {
        logger.info("Creating new result: {}", result);
        try {
            Result savedResult = resultService.save(result);
            logger.info("Created result with id: {}", savedResult.getId());
            return ResponseEntity.ok(savedResult);
        } catch (Exception e) {
            logger.error("Error creating result: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(@PathVariable Long id, @RequestBody Result result) {
        logger.info("Updating result with id: {}", id);
        resultService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
        
        result.setId(id);
        Result updatedResult = resultService.save(result);
        logger.info("Updated result with id: {}", id);
        return ResponseEntity.ok(updatedResult);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResult(@PathVariable Long id) {
        logger.info("Deleting result with id: {}", id);
        if (!resultService.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Result not found with id: " + id);
        }
        
        resultService.deleteById(id);
        logger.info("Deleted result with id: {}", id);
        return ResponseEntity.ok(Map.of("message", "Result deleted successfully"));
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        logger.info("Testing results API");
        return ResponseEntity.ok(Map.of(
                "message", "Results API is working correctly",
                "timestamp", System.currentTimeMillis()
        ));
    }
} 