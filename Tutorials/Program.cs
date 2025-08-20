using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Tutorials.Data;
using Tutorials.Commands;
using Tutorials.Extensions;

// Check if this is a seed command
if (args.Length > 0 && args[0] == "seed")
{
    await SeedCommand.ExecuteAsync(args);
    return;
}

// Check if this is a migrate-categories command
if (args.Length > 0 && args[0] == "migrate-categories")
{
    await MigrateCategoriesCommand.ExecuteAsync(args);
    return;
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<TutorialsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS for development (still useful for API testing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add SPA services
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist";
});

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TutorialsDbContext>();
    await DatabaseSeeder.SeedAsync(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Configure static files and SPA
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

// API routes
app.MapGet("/api", () => new { message = "Welcome to tutorial API." });

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/api/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

// Configure SPA
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    
    if (app.Environment.IsDevelopment())
    {
        // In development, serve from built dist folder
        var distPath = Path.Combine(app.Environment.ContentRootPath, "ClientApp", "dist");
        if (Directory.Exists(distPath))
        {
            spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(distPath)
            };
        }
        else
        {
            // Fallback: use Vite dev server if dist doesn't exist
            spa.UseViteDevelopmentServer(npmScript: "start");
        }
    }
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
