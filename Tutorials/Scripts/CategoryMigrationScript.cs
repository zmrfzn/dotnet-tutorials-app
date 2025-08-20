using Microsoft.EntityFrameworkCore;
using Tutorials.Data;
using Tutorials.Services;

namespace Tutorials.Scripts;

public class CategoryMigrationScript
{
    public static async Task UpdateCategoriesToIds(TutorialsDbContext context)
    {
        Console.WriteLine("Starting category migration from names to IDs...");
        
        var tutorials = await context.Tutorials.ToListAsync();
        var updatedCount = 0;
        
        foreach (var tutorial in tutorials)
        {
            if (!string.IsNullOrEmpty(tutorial.Category))
            {
                var categoryId = CategoryService.GetCategoryId(tutorial.Category);
                if (categoryId != null && categoryId != tutorial.Category)
                {
                    Console.WriteLine($"Updating tutorial '{tutorial.Title}': '{tutorial.Category}' -> '{categoryId}'");
                    tutorial.Category = categoryId;
                    updatedCount++;
                }
            }
        }
        
        if (updatedCount > 0)
        {
            await context.SaveChangesAsync();
            Console.WriteLine($"Successfully updated {updatedCount} tutorials with category IDs.");
        }
        else
        {
            Console.WriteLine("No tutorials needed category updates.");
        }
    }
}
