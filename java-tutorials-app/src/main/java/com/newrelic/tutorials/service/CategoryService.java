package com.newrelic.tutorials.service;

import com.newrelic.tutorials.dto.CategoryDto;
import com.newrelic.tutorials.model.Category;
import com.newrelic.tutorials.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(String.valueOf(c.getId()), c.getTitle()))
                .collect(Collectors.toList());
    }

    public String getCategoryId(String categoryName) {
        if (categoryName == null) return null;
        return categoryRepository.findByTitleIgnoreCase(categoryName)
                .map(c -> String.valueOf(c.getId()))
                .orElse(null);
    }
}
