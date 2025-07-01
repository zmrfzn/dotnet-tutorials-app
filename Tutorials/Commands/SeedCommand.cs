using Microsoft.EntityFrameworkCore;
using Tutorials.Data;

namespace Tutorials.Commands;

public static class SeedCommand
{
    public static async Task ExecuteAsync(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        var optionsBuilder = new DbContextOptionsBuilder<TutorialsDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        using var context = new TutorialsDbContext(optionsBuilder.Options);
        
        // Clear existing data
        Console.WriteLine("Clearing existing tutorials...");
        var existingTutorials = await context.Tutorials.ToListAsync();
        context.Tutorials.RemoveRange(existingTutorials);
        await context.SaveChangesAsync();
        Console.WriteLine($"Removed {existingTutorials.Count} existing tutorials.");

        // Seed new data
        Console.WriteLine("Seeding new tutorials...");
        await DatabaseSeeder.SeedAsync(context, forceReseed: true);
        
        var count = await context.Tutorials.CountAsync();
        Console.WriteLine($"Successfully seeded {count} tutorials!");
    }
}
