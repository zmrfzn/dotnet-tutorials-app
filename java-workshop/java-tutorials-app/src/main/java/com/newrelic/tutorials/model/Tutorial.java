package com.newrelic.tutorials.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Tutorials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tutorial {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @Size(max = 2000)
    private String description;

    @Size(max = 100)
    private String author;

    @Size(max = 50)
    private String category;

    @Builder.Default
    private boolean published = false;

    private Integer readTime;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DifficultyLevel difficulty = DifficultyLevel.Beginner;

    @Size(max = 500)
    private String tags;

    @Size(max = 500)
    private String imageUrl;

    @Builder.Default
    private int viewCount = 0;

    @Builder.Default
    private int likes = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
