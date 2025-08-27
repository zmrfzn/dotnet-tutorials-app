using Tutorials.DTOs;

namespace Tutorials.Services;

public class CategoryService
{
    // Mapping based on the original seed data pattern
    private static readonly Dictionary<string, string> CategoryIdToNameMap = new()
    {
        { "1", "Frontend Development" },
        { "2", "Programming Languages" },
        { "3", "Mobile Development" },
        { "4", "Data Science" },
        { "5", "DevOps" },
        { "6", "Design" },
        { "7", "Career Development" },
        { "8", "Backend Development" },
        { "9", "Full Stack Development" },
        { "10", "Cloud Computing" },
        { "11", "Development Tools" }
    };

    private static readonly Dictionary<string, string> CategoryNameToIdMap = 
        CategoryIdToNameMap.ToDictionary(kvp => kvp.Value, kvp => kvp.Key);

    public static CategoryDto[] GetAllCategories()
    {
        return CategoryIdToNameMap
            .Select(kvp => new CategoryDto { Id = kvp.Key, Category = kvp.Value })
            .OrderBy(c => c.Category)
            .ToArray();
    }

    public static string? GetCategoryName(string? categoryId)
    {
        if (string.IsNullOrEmpty(categoryId))
            return null;
            
        return CategoryIdToNameMap.GetValueOrDefault(categoryId);
    }

    public static string? GetCategoryId(string? categoryName)
    {
        if (string.IsNullOrEmpty(categoryName))
            return null;
            
        return CategoryNameToIdMap.GetValueOrDefault(categoryName);
    }
}
