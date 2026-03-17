package com.newrelic.tutorials.repository;

import com.newrelic.tutorials.model.Tutorial;
import com.newrelic.tutorials.model.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TutorialRepository extends JpaRepository<Tutorial, UUID> {
    List<Tutorial> findByTitleContainingIgnoreCaseOrderByUpdatedAtDesc(String title);
    List<Tutorial> findByPublishedTrueOrderByUpdatedAtDesc();
    List<Tutorial> findByDifficultyOrderByUpdatedAtDesc(DifficultyLevel difficulty);
    List<Tutorial> findAllByOrderByUpdatedAtDesc();
}
