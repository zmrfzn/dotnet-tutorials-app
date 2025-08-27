using Microsoft.EntityFrameworkCore;
using Tutorials.Data;
using Tutorials.Scripts;

namespace Tutorials.Commands;

public class MigrateCategoriesCommand
{
    public static async Task ExecuteAsync(string[] args)
    {
        Console.WriteLine("Running category migration command...");
        
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        var optionsBuilder = new DbContextOptionsBuilder<TutorialsDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        using var context = new TutorialsDbContext(optionsBuilder.Options);
        
        try
        {
            // Ensure database exists
            await context.Database.EnsureCreatedAsync();
            
            // Run category migration
            await CategoryMigrationScript.UpdateCategoriesToIds(context);
            
            Console.WriteLine("Category migration completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during category migration: {ex.Message}");
            throw;
        }
    }
}
