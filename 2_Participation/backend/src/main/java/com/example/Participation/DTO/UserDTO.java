package com.example.Participation.DTO;

import java.time.LocalDateTime;

public class UserDTO {
    private Long userId;
    private String name;
    private String clgName;
    private String email;
    private String phoneNo;
    private String roles;
    private LocalDateTime date;

    // Default constructor
    public UserDTO() {
    }

    // Constructor with all fields
    public UserDTO(Long userId, String name, String clgName, String email, String phoneNo, String roles,
            LocalDateTime date) {
        this.userId = userId;
        this.name = name;
        this.clgName = clgName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.roles = roles;
        this.date = date;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClgName() {
        return clgName;
    }

    public void setClgName(String clgName) {
        this.clgName = clgName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}