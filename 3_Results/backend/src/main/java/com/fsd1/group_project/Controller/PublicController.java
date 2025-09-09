package com.fsd1.group_project.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PublicController {

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
                "message", "Backend is working correctly",
                "timestamp", System.currentTimeMillis()
        ));
    }
}