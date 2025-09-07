package com.example.Participation.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "participation")
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long P_ID;  // Auto-incremented Primary Key

    @Column(name = "referral_source")
    private String referralSource;  // Referral source

    @Column(name = "med_cond")
    private String medicalCondition;  // Medical condition

    @Column(name = "department")
    private String department;  // Department

    @Column(name = "event")
    private String eventName;  // eventName name

    @Column(name = "gender")
    private String gender;  // Gender

    @Column(name = "type")
    private String type;  // Participation type (Internal/External)

    @Column(name = "age")
    private Integer age;  // Age

    @Column(name = "username", nullable = false)  // Ensure the username is mapped to a column in the database
    private String username;  // Username (email or identifier)

    // Getters and Setters
    public Long getP_ID() {
        return P_ID;
    }

    public void setP_ID(Long P_ID) {
        this.P_ID = P_ID;
    }

    public String getReferralSource() {
        return referralSource;
    }

    public void setReferralSource(String referralSource) {
        this.referralSource = referralSource;
    }

    public String getmedicalCondition() {
        return medicalCondition;
    }

    public void setmedicalCondition(String medicalCondition) {
        this.medicalCondition = medicalCondition;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String geteventName() {
        return eventName;
    }

    public void seteventName(String eventName) {
        this.eventName = eventName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Override toString() for displaying object data
    @Override
    public String toString() {
        return "Participation{" +
                "P_ID=" + P_ID +
                ", referralSource='" + referralSource + '\'' +
                ", medicalCondition='" + medicalCondition + '\'' +
                ", department='" + department + '\'' +
                ", event='" + eventName + '\'' +
                ", gender='" + gender + '\'' +
                ", type='" + type + '\'' +
                ", age=" + age +
                ", username='" + username + '\'' +
                '}';
    }
}
