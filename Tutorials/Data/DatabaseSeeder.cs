using Tutorials.Data;
using Tutorials.Models;

namespace Tutorials.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(TutorialsDbContext context, bool forceReseed = false)
    {
        // Check if tutorials already exist to avoid duplicate seeding
        if (!forceReseed && context.Tutorials.Any())
        {
            return; // Database has been seeded
        }

        var tutorials = GetSeedTutorials();
        
        context.Tutorials.AddRange(tutorials);
        await context.SaveChangesAsync();
    }

    private static List<Tutorial> GetSeedTutorials()
    {
        var random = new Random();
        
        var tutorials = new List<Tutorial>
        {
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Getting Started with React 18",
                Description = "Learn the fundamentals of React 18, including new features like Concurrent Rendering, Automatic Batching, and Transitions. This beginner-friendly tutorial takes you through setting up your first React application and building a simple component-based UI with hooks and state management.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-120),
                UpdatedAt = DateTime.UtcNow.AddDays(-110),
                Author = "Sarah Johnson",
                Category = "Frontend Development",
                ReadTime = 15,
                Difficulty = DifficultyLevel.Beginner,
                Tags = "react,javascript,frontend,hooks",
                ImageUrl = "https://picsum.photos/id/0/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Building Responsive Layouts with CSS Grid",
                Description = "Master CSS Grid layout to create modern, responsive web designs that adapt to any screen size. This tutorial covers grid templates, areas, gaps, and how to combine Grid with Flexbox for powerful layouts. Includes practical examples and common layout patterns you can use in your projects.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-100),
                UpdatedAt = DateTime.UtcNow.AddDays(-95),
                Author = "Alex Chen",
                Category = "Frontend Development",
                ReadTime = 12,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "css,layout,responsive,design",
                ImageUrl = "https://picsum.photos/id/1/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Introduction to TypeScript for JavaScript Developers",
                Description = "Transform your JavaScript skills into TypeScript proficiency. Learn how static typing can prevent bugs, improve IDE support, and make your code more maintainable. This tutorial walks through converting a JavaScript project to TypeScript, explaining interfaces, types, generics, and best practices.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-90),
                UpdatedAt = DateTime.UtcNow.AddDays(-85),
                Author = "Michael Rodriguez",
                Category = "Programming Languages",
                ReadTime = 20,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "typescript,javascript,web development",
                ImageUrl = "https://picsum.photos/id/2/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "React Native: Build Your First Mobile App",
                Description = "Learn to build cross-platform mobile apps with React Native. This comprehensive guide covers setting up your development environment, creating your first app, implementing navigation, and deploying to app stores. Perfect for React developers looking to expand into mobile development.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-80),
                UpdatedAt = DateTime.UtcNow.AddDays(-75),
                Author = "Jessica Williams",
                Category = "Mobile Development",
                ReadTime = 25,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "react-native,mobile,ios,android",
                ImageUrl = "https://picsum.photos/id/3/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Advanced State Management with Redux Toolkit",
                Description = "Take your Redux skills to the next level with Redux Toolkit. Learn how RTK simplifies store setup, reduces boilerplate, and improves developer experience. This tutorial covers slices, thunks, selectors, and integration with React for efficient global state management.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-70),
                UpdatedAt = DateTime.UtcNow.AddDays(-65),
                Author = "David Kim",
                Category = "Frontend Development",
                ReadTime = 18,
                Difficulty = DifficultyLevel.Advanced,
                Tags = "redux,react,state-management,javascript",
                ImageUrl = "https://picsum.photos/id/4/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Building RESTful APIs with Node.js and Express",
                Description = "Learn to create robust, scalable REST APIs using Node.js and Express. This tutorial covers route handling, middleware, authentication, error handling, and database integration. By the end, you'll have built a fully functional API ready for production use.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-60),
                UpdatedAt = DateTime.UtcNow.AddDays(-55),
                Author = "Emily Clark",
                Category = "Backend Development",
                ReadTime = 22,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "node.js,express,api,backend",
                ImageUrl = "https://picsum.photos/id/5/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Getting Started with Docker for Web Developers",
                Description = "Simplify your development workflow with Docker. Learn how to containerize your web applications, set up development environments, and manage multi-container applications with Docker Compose. This practical guide is perfect for developers looking to standardize their development and deployment processes.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-50),
                UpdatedAt = DateTime.UtcNow.AddDays(-45),
                Author = "Robert Martinez",
                Category = "DevOps",
                ReadTime = 15,
                Difficulty = DifficultyLevel.Beginner,
                Tags = "docker,devops,containers,deployment",
                ImageUrl = "https://picsum.photos/id/6/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Python Data Analysis with Pandas",
                Description = "Master data manipulation and analysis in Python using the powerful Pandas library. This tutorial guides you through importing, cleaning, transforming, and visualizing data with practical examples. Perfect for aspiring data scientists and analysts looking to enhance their data processing skills.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-40),
                UpdatedAt = DateTime.UtcNow.AddDays(-35),
                Author = "Sophie Anderson",
                Category = "Data Science",
                ReadTime = 20,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "python,pandas,data-analysis,data-science",
                ImageUrl = "https://picsum.photos/id/7/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Introduction to Machine Learning with scikit-learn",
                Description = "Begin your journey into machine learning with Python's scikit-learn library. This beginner-friendly tutorial covers fundamental ML concepts, preparing datasets, choosing algorithms, training models, and evaluating performance. No advanced math required—just practical, hands-on examples to get you started.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-25),
                Author = "Daniel Wilson",
                Category = "Data Science",
                ReadTime = 30,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "machine-learning,python,scikit-learn,ai",
                ImageUrl = "https://picsum.photos/id/8/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Modern CSS Techniques Every Developer Should Know",
                Description = "Level up your CSS skills with modern techniques like custom properties, logical properties, container queries, and the new color functions. This tutorial shows how to use these features to create more maintainable, flexible stylesheets that work across browsers.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-15),
                Author = "Lisa Brown",
                Category = "Frontend Development",
                ReadTime = 15,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "css,web-design,frontend",
                ImageUrl = "https://picsum.photos/id/9/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Building a Full-Stack JavaScript Application with MERN",
                Description = "Create a complete web application using the MERN stack (MongoDB, Express, React, Node.js). This comprehensive tutorial takes you through building both frontend and backend, implementing authentication, state management, and database operations to create a fully functional app.",
                Published = true,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                Author = "Chris Taylor",
                Category = "Full Stack Development",
                ReadTime = 35,
                Difficulty = DifficultyLevel.Advanced,
                Tags = "mern,javascript,full-stack,mongodb",
                ImageUrl = "https://picsum.photos/id/10/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Flutter vs React Native: Choosing the Right Mobile Framework",
                Description = "Comparing Flutter and React Native to help you choose the best framework for your mobile app project. This detailed comparison covers performance, development experience, community support, and use cases to guide your decision.",
                Published = false,
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-12),
                Author = "Natalie Cooper",
                Category = "Mobile Development",
                ReadTime = 18,
                Difficulty = DifficultyLevel.Intermediate,
                Tags = "flutter,react-native,mobile-development,comparison",
                ImageUrl = "https://picsum.photos/id/11/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Introduction to AWS for Developers",
                Description = "Navigate the AWS ecosystem as a developer with this beginner-friendly guide. Learn about core services like EC2, S3, Lambda, and DynamoDB, and how to use them to deploy scalable applications. Includes practical examples and best practices for cloud architecture.",
                Published = false,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                Author = "James Miller",
                Category = "Cloud Computing",
                ReadTime = 25,
                Difficulty = DifficultyLevel.Beginner,
                Tags = "aws,cloud,devops,serverless",
                ImageUrl = "https://picsum.photos/id/12/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Effective Communication Skills for Tech Professionals",
                Description = "Enhance your communication skills to advance your tech career. This guide covers technical documentation, presenting complex ideas, active listening, and collaborating effectively with non-technical stakeholders. Perfect for developers looking to improve their soft skills.",
                Published = false,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                Author = "Rachel Lee",
                Category = "Career Development",
                ReadTime = 12,
                Difficulty = DifficultyLevel.Beginner,
                Tags = "soft-skills,communication,career,professional-development",
                ImageUrl = "https://picsum.photos/id/13/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "Mastering Git and GitHub Workflows",
                Description = "Level up your version control skills with advanced Git techniques and GitHub collaboration workflows. Learn branching strategies, rebasing, cherry-picking, and how to manage complex projects with multiple contributors. Ideal for developers working in team environments.",
                Published = false,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3),
                Author = "Thomas Garcia",
                Category = "Development Tools",
                ReadTime = 20,
                Difficulty = DifficultyLevel.Advanced,
                Tags = "git,github,version-control,collaboration",
                ImageUrl = "https://picsum.photos/id/14/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            },
            new Tutorial
            {
                Id = Guid.NewGuid(),
                Title = "UI/UX Design Principles for Developers",
                Description = "Learn essential design principles that every developer should know. This tutorial covers user-centered design, visual hierarchy, color theory, typography, and accessibility. By understanding these concepts, you can create more intuitive, visually appealing interfaces even without a design background.",
                Published = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                Author = "Olivia White",
                Category = "Design",
                ReadTime = 15,
                Difficulty = DifficultyLevel.Beginner,
                Tags = "ui,ux,design,frontend",
                ImageUrl = "https://picsum.photos/id/15/600/400",
                ViewCount = random.Next(0, 1000),
                Likes = random.Next(0, 100)
            }
        };

        return tutorials;
    }
}
