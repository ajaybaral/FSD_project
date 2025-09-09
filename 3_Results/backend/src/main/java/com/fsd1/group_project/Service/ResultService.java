package com.fsd1.group_project.Service;

import com.fsd1.group_project.Entity.Result;
import com.fsd1.group_project.Repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ParticipationClient participationClient;

    public List<Result> findAll() {
        return resultRepository.findAll();
    }

    public Optional<Result> findById(Long id) {
        return resultRepository.findById(id);
    }

    public Result save(Result result) {
        // Validate participant id with Participation service if present
        if (StringUtils.hasText(result.getpId())) {
            boolean exists = participationClient.doesParticipationExistById(result.getpId());
            if (!exists) {
                throw new IllegalArgumentException("Invalid participant id: " + result.getpId());
            }
        }
        return resultRepository.save(result);
    }

    public void deleteById(Long id) {
        resultRepository.deleteById(id);
    }
} 