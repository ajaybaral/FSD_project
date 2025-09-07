package com.example.Participation.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registered_users")
public class RegisteredUser {

    @Id
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "clg_name")
    private String clgName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_no")
    private String phoneNo;

    private String roles;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    // Default constructor
    public RegisteredUser() {
    }

    // Constructor
    public RegisteredUser(Long userId, String name, String clgName, String email, String phoneNo, String roles,
            LocalDateTime registrationDate) {
        this.userId = userId;
        this.name = name;
        this.clgName = clgName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.roles = roles;
        this.registrationDate = registrationDate;
        this.lastUpdated = LocalDateTime.now();
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

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}