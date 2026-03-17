package com.newrelic.tutorials.dto;

import com.newrelic.tutorials.model.DifficultyLevel;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TutorialResponseDto {
    private UUID id;
    private String title;
    private String description;
    private String author;
    private String category;
    private boolean published;
    private Integer readTime;
    private DifficultyLevel difficulty;
    private String tags;
    private String imageUrl;
    private int viewCount;
    private int likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
