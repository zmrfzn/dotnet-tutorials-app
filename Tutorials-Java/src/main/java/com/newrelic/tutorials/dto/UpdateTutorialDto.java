package com.newrelic.tutorials.dto;

import com.newrelic.tutorials.model.DifficultyLevel;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTutorialDto {
    @Size(max = 200)
    private String title;

    @Size(max = 2000)
    private String description;

    @Size(max = 100)
    private String author;

    @Size(max = 50)
    private String category;

    private Boolean published;

    private Integer readTime;

    private DifficultyLevel difficulty;

    @Size(max = 500)
    private String tags;

    @Size(max = 500)
    private String imageUrl;
}
