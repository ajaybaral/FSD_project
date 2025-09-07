package com.fsd1.group_project.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    private String name;
    private String clg_name;

    @Column(unique = true)
    private String email;
    private String resetToken;
    private LocalDateTime tokenCreationDate;

    @Column(unique = true)
    private String phone_no;

    private LocalDateTime date;

    private String password;

    @Column(name = "roles") // Store roles as a comma-separated string
    private String roles;

    // Default constructor
    public User() {
    }

    // Constructor with all fields
    public User(Long user_id, String name, String clg_name, String email, String resetToken,
            LocalDateTime tokenCreationDate, String phone_no, LocalDateTime date,
            String password, String roles) {
        this.user_id = user_id;
        this.name = name;
        this.clg_name = clg_name;
        this.email = email;
        this.resetToken = resetToken;
        this.tokenCreationDate = tokenCreationDate;
        this.phone_no = phone_no;
        this.date = date;
        this.password = password;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClg_name() {
        return clg_name;
    }

    public void setClg_name(String clg_name) {
        this.clg_name = clg_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public LocalDateTime getTokenCreationDate() {
        return tokenCreationDate;
    }

    public void setTokenCreationDate(LocalDateTime tokenCreationDate) {
        this.tokenCreationDate = tokenCreationDate;
    }

    public String getPhone_no() {
        return phone_no;
    }

    public void setPhone_no(String phone_no) {
        this.phone_no = phone_no;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }
}