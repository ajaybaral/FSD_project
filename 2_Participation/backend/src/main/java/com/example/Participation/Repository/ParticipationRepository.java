package com.example.Participation.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Participation.Entity.Participation;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByUsername(String username);
}