package com.newrelic.tutorials.controller;

import com.newrelic.api.agent.NewRelic;
import com.newrelic.tutorials.dto.*;
import com.newrelic.tutorials.model.DifficultyLevel;
import com.newrelic.tutorials.model.Tutorial;
import com.newrelic.tutorials.repository.TutorialRepository;
import com.newrelic.tutorials.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tutorials")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TutorialsController {

    private final TutorialRepository tutorialRepository;
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<?> createTutorial(@Valid @RequestBody CreateTutorialDto dto) {
        try {
            String categoryId = categoryService.getCategoryId(dto.getCategory());
            Tutorial tutorial = Tutorial.builder()
                    .title(dto.getTitle())
                    .description(dto.getDescription())
                    .author(dto.getAuthor())
                    .category(categoryId != null ? categoryId : dto.getCategory())
                    .published(dto.isPublished())
                    .readTime(dto.getReadTime())
                    .difficulty(dto.getDifficulty())
                    .tags(dto.getTags())
                    .imageUrl(dto.getImageUrl())
                    .build();

            Tutorial savedTutorial = tutorialRepository.save(tutorial);
            log.info("Created tutorial with ID: {}", savedTutorial.getId());

            return new ResponseEntity<>(mapToResponseDto(savedTutorial), HttpStatus.CREATED);
        } catch (Exception ex) {
            log.error("Error creating tutorial", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Some error occurred while creating the Tutorial."));
        }
    }

    @GetMapping
    public ResponseEntity<?> getTutorials(@RequestParam(required = false) String title) {
        try {
            List<Tutorial> tutorials;
            if (title != null && !title.isEmpty()) {
                tutorials = tutorialRepository.findByTitleContainingIgnoreCaseOrderByUpdatedAtDesc(title);
            } else {
                tutorials = tutorialRepository.findAllByOrderByUpdatedAtDesc();
            }

            log.info("Retrieved {} tutorials", tutorials.size());
            return ResponseEntity.ok(tutorials.stream().map(this::mapToResponseDto).collect(Collectors.toList()));
        } catch (Exception ex) {
            log.error("Error retrieving tutorials", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Some error occurred while retrieving tutorials."));
        }
    }

    @GetMapping("/published")
    public ResponseEntity<?> getPublishedTutorials() {
        try {
            List<Tutorial> tutorials = tutorialRepository.findByPublishedTrueOrderByUpdatedAtDesc();
            return ResponseEntity.ok(tutorials.stream().map(this::mapToResponseDto).collect(Collectors.toList()));
        } catch (Exception ex) {
            log.error("Error retrieving published tutorials", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Some error occurred while retrieving published tutorials."));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            return ResponseEntity.ok(categoryService.getAllCategories());
        } catch (Exception ex) {
            log.error("Error retrieving categories", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Some error occurred while retrieving categories."));
        }
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<?> getTutorialsByDifficulty(@PathVariable DifficultyLevel difficulty) {
        try {
            List<Tutorial> tutorials = tutorialRepository.findByDifficultyOrderByUpdatedAtDesc(difficulty);
            return ResponseEntity.ok(tutorials.stream().map(this::mapToResponseDto).collect(Collectors.toList()));
        } catch (Exception ex) {
            log.error("Error retrieving tutorials by difficulty", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Some error occurred while retrieving tutorials by difficulty."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTutorial(@PathVariable UUID id) {
        try {
            Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

            if (tutorialData.isPresent()) {
                return ResponseEntity.ok(mapToResponseDto(tutorialData.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Cannot find Tutorial with id=" + id + "."));
            }
        } catch (Exception ex) {
            log.error("Error retrieving tutorial with ID: {}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving Tutorial with id=" + id));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTutorial(@PathVariable UUID id, @RequestBody UpdateTutorialDto dto) {
        try {
            Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

            if (tutorialData.isPresent()) {
                Tutorial tutorial = tutorialData.get();
                if (dto.getTitle() != null) tutorial.setTitle(dto.getTitle());
                if (dto.getDescription() != null) tutorial.setDescription(dto.getDescription());
                if (dto.getAuthor() != null) tutorial.setAuthor(dto.getAuthor());
                if (dto.getCategory() != null) {
                    String categoryId = categoryService.getCategoryId(dto.getCategory());
                    tutorial.setCategory(categoryId != null ? categoryId : dto.getCategory());
                }
                if (dto.getPublished() != null) tutorial.setPublished(dto.getPublished());
                if (dto.getReadTime() != null) tutorial.setReadTime(dto.getReadTime());
                if (dto.getDifficulty() != null) tutorial.setDifficulty(dto.getDifficulty());
                if (dto.getTags() != null) tutorial.setTags(dto.getTags());
                if (dto.getImageUrl() != null) tutorial.setImageUrl(dto.getImageUrl());

                tutorialRepository.save(tutorial);
                log.info("Updated tutorial with ID: {}", id);
                return ResponseEntity.ok(Map.of("message", "Tutorial was updated successfully."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Cannot update Tutorial with id=" + id + ". Tutorial was not found!"));
            }
        } catch (Exception ex) {
            log.error("Error updating tutorial with ID: {}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating Tutorial with id=" + id));
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> updateViewCount(@PathVariable UUID id) {
        try {
            Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

            if (tutorialData.isPresent()) {
                Tutorial tutorial = tutorialData.get();
                tutorial.setViewCount(tutorial.getViewCount() + 1);
                tutorialRepository.save(tutorial);
                return ResponseEntity.ok(Map.of("message", "View count updated successfully.", "viewCount", tutorial.getViewCount()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Cannot find Tutorial with id=" + id + "."));
            }
        } catch (Exception ex) {
            log.error("Error updating view count for tutorial with ID: {}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating view count for Tutorial with id=" + id));
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> updateLikes(@PathVariable UUID id, @RequestBody Map<String, Boolean> body) {
        try {
            boolean increment = body.getOrDefault("increment", true);
            Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

            if (tutorialData.isPresent()) {
                Tutorial tutorial = tutorialData.get();
                if (increment) {
                    tutorial.setLikes(tutorial.getLikes() + 1);
                } else {
                    tutorial.setLikes(Math.max(0, tutorial.getLikes() - 1));
                }
                tutorialRepository.save(tutorial);
                return ResponseEntity.ok(Map.of("message", "Likes updated successfully.", "likes", tutorial.getLikes()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Cannot find Tutorial with id=" + id + "."));
            }
        } catch (Exception ex) {
            log.error("Error updating likes for tutorial with ID: {}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating likes for Tutorial with id=" + id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTutorial(@PathVariable UUID id) {
        try {
            Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

            if (tutorialData.isPresent()) {
                tutorialRepository.delete(tutorialData.get());
                log.info("Deleted tutorial with ID: {}", id);
                return ResponseEntity.ok(Map.of("message", "Tutorial was deleted successfully!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Cannot delete Tutorial with id=" + id + ". Tutorial was not found!"));
            }
        } catch (Exception ex) {
            log.error("Error deleting tutorial with ID: {}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Could not delete Tutorial with id=" + id));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllTutorials() {
        try {
            long count = tutorialRepository.count();
            tutorialRepository.deleteAll();
            log.info("Deleted all tutorials. Count: {}", count);
            return ResponseEntity.ok(Map.of("message", count + " Tutorials were deleted successfully!"));
        } catch (Exception ex) {
            log.error("Error deleting all tutorials", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Some error occurred while removing all tutorials."));
        }
    }

    private TutorialResponseDto mapToResponseDto(Tutorial tutorial) {
        TutorialResponseDto dto = new TutorialResponseDto();
        dto.setId(tutorial.getId());
        dto.setTitle(tutorial.getTitle());
        dto.setDescription(tutorial.getDescription());
        dto.setAuthor(tutorial.getAuthor());
        dto.setCategory(tutorial.getCategory());
        dto.setPublished(tutorial.isPublished());
        dto.setReadTime(tutorial.getReadTime());
        dto.setDifficulty(tutorial.getDifficulty());
        dto.setTags(tutorial.getTags());
        dto.setImageUrl(tutorial.getImageUrl());
        dto.setViewCount(tutorial.getViewCount());
        dto.setLikes(tutorial.getLikes());
        dto.setCreatedAt(tutorial.getCreatedAt());
        dto.setUpdatedAt(tutorial.getUpdatedAt());
        return dto;
    }

    // -------------------------------------------------------------------------
    // Demo error endpoint — used in the observability workshop to demonstrate
    // New Relic error tracking, Logs in Context, and distributed tracing.
    // -------------------------------------------------------------------------
    @GetMapping("/demo-error")
    public ResponseEntity<?> demoError(
            @RequestParam(defaultValue = "tutorial-not-found") String errorType) {
        try {
            // Custom attributes appear in the Attributes section of the error in NR
            NewRelic.addCustomAttribute("error.type", errorType);
            NewRelic.addCustomAttribute("error.endpoint", "/api/tutorials/demo-error");

            log.error("Demo error triggered: errorType={}", errorType);
            throw new RuntimeException(
                    "Demo error [" + errorType + "]: intentional error for observability workshop");
        } catch (RuntimeException e) {
            NewRelic.noticeError(e);
            log.error("New Relic noticeError called for: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", e.getMessage(),
                            "errorType", errorType,
                            "hint", "Check New Relic Errors Inbox for this error with linked traces and logs"
                    ));
        }
    }
}
