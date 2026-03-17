package com.newrelic.tutorials.repository;

import com.newrelic.tutorials.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByTitleIgnoreCase(String title);
}
