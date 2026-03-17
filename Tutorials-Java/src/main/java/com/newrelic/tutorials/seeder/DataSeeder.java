package com.newrelic.tutorials.seeder;

import com.newrelic.tutorials.model.Category;
import com.newrelic.tutorials.model.DifficultyLevel;
import com.newrelic.tutorials.model.Tutorial;
import com.newrelic.tutorials.repository.CategoryRepository;
import com.newrelic.tutorials.repository.TutorialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final TutorialRepository tutorialRepository;
    private final CategoryRepository categoryRepository;
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        if (args.length > 0 && "seed".equals(args[0])) {
            seedDatabase(true);
            System.exit(0);
        } else if (tutorialRepository.count() == 0) {
            seedDatabase(false);
        }
    }

    public void seedDatabase(boolean force) {
        if (force) {
            log.info("Force re-seeding database...");
            tutorialRepository.deleteAll();
            categoryRepository.deleteAll();
        }

        seedCategories();
        seedTutorials();
        log.info("Database seeding completed.");
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) return;

        List<String> categories = Arrays.asList(
                "Frontend Development", "Backend Development", "Programming Languages",
                "Mobile Development", "DevOps", "Data Science", "Full Stack Development",
                "Cloud Computing", "Career Development", "Development Tools", "Design"
        );

        categories.forEach(title -> {
            Category category = new Category();
            category.setTitle(title);
            categoryRepository.save(category);
        });
        log.info("Seeded {} categories", categories.size());
    }

    private void seedTutorials() {
        if (tutorialRepository.count() > 0) return;

        List<Tutorial> tutorials = Arrays.asList(
                Tutorial.builder()
                        .title("Getting Started with React 18")
                        .description("Learn the fundamentals of React 18, including new features like Concurrent Rendering, Automatic Batching, and Transitions. This beginner-friendly tutorial takes you through setting up your first React application and building a simple component-based UI with hooks and state management.")
                        .published(true)
                        .author("Sarah Johnson")
                        .category("Frontend Development")
                        .readTime(15)
                        .difficulty(DifficultyLevel.Beginner)
                        .tags("react,javascript,frontend,hooks")
                        .imageUrl("https://picsum.photos/id/0/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Building Responsive Layouts with CSS Grid")
                        .description("Master CSS Grid layout to create modern, responsive web designs that adapt to any screen size. This tutorial covers grid templates, areas, gaps, and how to combine Grid with Flexbox for powerful layouts. Includes practical examples and common layout patterns you can use in your projects.")
                        .published(true)
                        .author("Alex Chen")
                        .category("Frontend Development")
                        .readTime(12)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("css,layout,responsive,design")
                        .imageUrl("https://picsum.photos/id/1/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Introduction to TypeScript for JavaScript Developers")
                        .description("Transform your JavaScript skills into TypeScript proficiency. Learn how static typing can prevent bugs, improve IDE support, and make your code more maintainable. This tutorial walks through converting a JavaScript project to TypeScript, explaining interfaces, types, generics, and best practices.")
                        .published(true)
                        .author("Michael Rodriguez")
                        .category("Programming Languages")
                        .readTime(20)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("typescript,javascript,web development")
                        .imageUrl("https://picsum.photos/id/2/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("React Native: Build Your First Mobile App")
                        .description("Learn to build cross-platform mobile apps with React Native. This comprehensive guide covers setting up your development environment, creating your first app, implementing navigation, and deploying to app stores. Perfect for React developers looking to expand into mobile development.")
                        .published(true)
                        .author("Jessica Williams")
                        .category("Mobile Development")
                        .readTime(25)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("react-native,mobile,ios,android")
                        .imageUrl("https://picsum.photos/id/3/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Advanced State Management with Redux Toolkit")
                        .description("Take your Redux skills to the next level with Redux Toolkit. Learn how RTK simplifies store setup, reduces boilerplate, and improves developer experience. This tutorial covers slices, thunks, selectors, and integration with React for efficient global state management.")
                        .published(true)
                        .author("David Kim")
                        .category("Frontend Development")
                        .readTime(18)
                        .difficulty(DifficultyLevel.Advanced)
                        .tags("redux,react,state-management,javascript")
                        .imageUrl("https://picsum.photos/id/4/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Building RESTful APIs with Node.js and Express")
                        .description("Learn to create robust, scalable REST APIs using Node.js and Express. This tutorial covers route handling, middleware, authentication, error handling, and database integration. By the end, you'll have built a fully functional API ready for production use.")
                        .published(true)
                        .author("Emily Clark")
                        .category("Backend Development")
                        .readTime(22)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("node.js,express,api,backend")
                        .imageUrl("https://picsum.photos/id/5/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Getting Started with Docker for Web Developers")
                        .description("Simplify your development workflow with Docker. Learn how to containerize your web applications, set up development environments, and manage multi-container applications with Docker Compose. This practical guide is perfect for developers looking to standardize their development and deployment processes.")
                        .published(true)
                        .author("Robert Martinez")
                        .category("DevOps")
                        .readTime(15)
                        .difficulty(DifficultyLevel.Beginner)
                        .tags("docker,devops,containers,deployment")
                        .imageUrl("https://picsum.photos/id/6/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Python Data Analysis with Pandas")
                        .description("Master data manipulation and analysis in Python using the powerful Pandas library. This tutorial guides you through importing, cleaning, transforming, and visualizing data with practical examples. Perfect for aspiring data scientists and analysts looking to enhance their data processing skills.")
                        .published(true)
                        .author("Sophie Anderson")
                        .category("Data Science")
                        .readTime(20)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("python,pandas,data-analysis,data-science")
                        .imageUrl("https://picsum.photos/id/7/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Introduction to Machine Learning with scikit-learn")
                        .description("Begin your journey into machine learning with Python's scikit-learn library. This beginner-friendly tutorial covers fundamental ML concepts, preparing datasets, choosing algorithms, training models, and evaluating performance. No advanced math required—just practical, hands-on examples to get you started.")
                        .published(true)
                        .author("Daniel Wilson")
                        .category("Data Science")
                        .readTime(30)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("machine-learning,python,scikit-learn,ai")
                        .imageUrl("https://picsum.photos/id/8/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Modern CSS Techniques Every Developer Should Know")
                        .description("Level up your CSS skills with modern techniques like custom properties, logical properties, container queries, and the new color functions. This tutorial shows how to use these features to create more maintainable, flexible stylesheets that work across browsers.")
                        .published(true)
                        .author("Lisa Brown")
                        .category("Frontend Development")
                        .readTime(15)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("css,web-design,frontend")
                        .imageUrl("https://picsum.photos/id/9/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Building a Full-Stack JavaScript Application with MERN")
                        .description("Create a complete web application using the MERN stack (MongoDB, Express, React, Node.js). This comprehensive tutorial takes you through building both frontend and backend, implementing authentication, state management, and database operations to create a fully functional app.")
                        .published(true)
                        .author("Chris Taylor")
                        .category("Full Stack Development")
                        .readTime(35)
                        .difficulty(DifficultyLevel.Advanced)
                        .tags("mern,javascript,full-stack,mongodb")
                        .imageUrl("https://picsum.photos/id/10/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Flutter vs React Native: Choosing the Right Mobile Framework")
                        .description("Comparing Flutter and React Native to help you choose the best framework for your mobile app project. This detailed comparison covers performance, development experience, community support, and use cases to guide your decision.")
                        .published(false)
                        .author("Natalie Cooper")
                        .category("Mobile Development")
                        .readTime(18)
                        .difficulty(DifficultyLevel.Intermediate)
                        .tags("flutter,react-native,mobile-development,comparison")
                        .imageUrl("https://picsum.photos/id/11/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Introduction to AWS for Developers")
                        .description("Navigate the AWS ecosystem as a developer with this beginner-friendly guide. Learn about core services like EC2, S3, Lambda, and DynamoDB, and how to use them to deploy scalable applications. Includes practical examples and best practices for cloud architecture.")
                        .published(false)
                        .author("James Miller")
                        .category("Cloud Computing")
                        .readTime(25)
                        .difficulty(DifficultyLevel.Beginner)
                        .tags("aws,cloud,devops,serverless")
                        .imageUrl("https://picsum.photos/id/12/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Effective Communication Skills for Tech Professionals")
                        .description("Enhance your communication skills to advance your tech career. This guide covers technical documentation, presenting complex ideas, active listening, and collaborating effectively with non-technical stakeholders. Perfect for developers looking to improve their soft skills.")
                        .published(false)
                        .author("Rachel Lee")
                        .category("Career Development")
                        .readTime(12)
                        .difficulty(DifficultyLevel.Beginner)
                        .tags("soft-skills,communication,career,professional-development")
                        .imageUrl("https://picsum.photos/id/13/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("Mastering Git and GitHub Workflows")
                        .description("Level up your version control skills with advanced Git techniques and GitHub collaboration workflows. Learn branching strategies, rebasing, cherry-picking, and how to manage complex projects with multiple contributors. Ideal for developers working in team environments.")
                        .published(false)
                        .author("Thomas Garcia")
                        .category("Development Tools")
                        .readTime(20)
                        .difficulty(DifficultyLevel.Advanced)
                        .tags("git,github,version-control,collaboration")
                        .imageUrl("https://picsum.photos/id/14/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build(),
                Tutorial.builder()
                        .title("UI/UX Design Principles for Developers")
                        .description("Learn essential design principles that every developer should know. This tutorial covers user-centered design, visual hierarchy, color theory, typography, and accessibility. By understanding these concepts, you can create more intuitive, visually appealing interfaces even without a design background.")
                        .published(false)
                        .author("Olivia White")
                        .category("Design")
                        .readTime(15)
                        .difficulty(DifficultyLevel.Beginner)
                        .tags("ui,ux,design,frontend")
                        .imageUrl("https://picsum.photos/id/15/600/400")
                        .viewCount(random.nextInt(1000))
                        .likes(random.nextInt(100))
                        .build()
        );

        // Map category names to IDs for consistency if needed, but here we just use names as in .NET
        tutorials.forEach(t -> {
            String categoryName = t.getCategory();
            categoryRepository.findByTitleIgnoreCase(categoryName).ifPresent(c -> {
                t.setCategory(String.valueOf(c.getId()));
            });
            tutorialRepository.save(t);
        });

        log.info("Seeded {} tutorials", tutorials.size());
    }
}
