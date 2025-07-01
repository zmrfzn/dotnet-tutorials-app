using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tutorials.Data;
using Tutorials.DTOs;
using Tutorials.Models;

namespace Tutorials.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TutorialsController : ControllerBase
{
    private readonly TutorialsDbContext _context;
    private readonly ILogger<TutorialsController> _logger;

    public TutorialsController(TutorialsDbContext context, ILogger<TutorialsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<TutorialResponseDto>> CreateTutorial(CreateTutorialDto dto)
    {
        try
        {
            var tutorial = new Tutorial
            {
                Title = dto.Title,
                Description = dto.Description,
                Author = dto.Author,
                Category = dto.Category,
                Published = dto.Published,
                ReadTime = dto.ReadTime,
                Difficulty = dto.Difficulty,
                Tags = dto.Tags,
                ImageUrl = dto.ImageUrl
            };

            _context.Tutorials.Add(tutorial);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created tutorial with ID: {TutorialId}", tutorial.Id);

            return CreatedAtAction(nameof(GetTutorial), new { id = tutorial.Id }, MapToResponseDto(tutorial));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tutorial");
            return StatusCode(500, new { message = "Some error occurred while creating the Tutorial." });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TutorialResponseDto>>> GetTutorials([FromQuery] string? title)
    {
        try
        {
            var query = _context.Tutorials.AsQueryable();
            
            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(t => t.Title.Contains(title));
            }
            
            var tutorials = await query
                .OrderByDescending(t => t.UpdatedAt)
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} tutorials", tutorials.Count);

            return Ok(tutorials.Select(MapToResponseDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tutorials");
            return StatusCode(500, new { message = "Some error occurred while retrieving tutorials." });
        }
    }

    [HttpGet("published")]
    public async Task<ActionResult<IEnumerable<TutorialResponseDto>>> GetPublishedTutorials()
    {
        try
        {
            var tutorials = await _context.Tutorials
                .Where(t => t.Published)
                .OrderByDescending(t => t.UpdatedAt)
                .ToListAsync();

            return Ok(tutorials.Select(MapToResponseDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving published tutorials");
            return StatusCode(500, new { message = "Some error occurred while retrieving published tutorials." });
        }
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        try
        {
            var categories = await _context.Tutorials
                .Where(t => !string.IsNullOrEmpty(t.Category))
                .Select(t => t.Category!)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return StatusCode(500, new { message = "Some error occurred while retrieving categories." });
        }
    }

    [HttpGet("difficulty/{difficulty}")]
    public async Task<ActionResult<IEnumerable<TutorialResponseDto>>> GetTutorialsByDifficulty(DifficultyLevel difficulty)
    {
        try
        {
            var tutorials = await _context.Tutorials
                .Where(t => t.Difficulty == difficulty)
                .OrderByDescending(t => t.UpdatedAt)
                .ToListAsync();

            return Ok(tutorials.Select(MapToResponseDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tutorials by difficulty");
            return StatusCode(500, new { message = "Some error occurred while retrieving tutorials by difficulty." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TutorialResponseDto>> GetTutorial(Guid id)
    {
        try
        {
            var tutorial = await _context.Tutorials.FindAsync(id);

            if (tutorial == null)
            {
                return NotFound(new { message = $"Cannot find Tutorial with id={id}." });
            }

            return Ok(MapToResponseDto(tutorial));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tutorial with ID: {TutorialId}", id);
            return StatusCode(500, new { message = $"Error retrieving Tutorial with id={id}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTutorial(Guid id, UpdateTutorialDto dto)
    {
        try
        {
            var tutorial = await _context.Tutorials.FindAsync(id);

            if (tutorial == null)
            {
                return NotFound(new { message = $"Cannot update Tutorial with id={id}. Tutorial was not found!" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(dto.Title)) tutorial.Title = dto.Title;
            if (dto.Description != null) tutorial.Description = dto.Description;
            if (dto.Author != null) tutorial.Author = dto.Author;
            if (dto.Category != null) tutorial.Category = dto.Category;
            if (dto.Published.HasValue) tutorial.Published = dto.Published.Value;
            if (dto.ReadTime.HasValue) tutorial.ReadTime = dto.ReadTime;
            if (dto.Difficulty.HasValue) tutorial.Difficulty = dto.Difficulty;
            if (dto.Tags != null) tutorial.Tags = dto.Tags;
            if (dto.ImageUrl != null) tutorial.ImageUrl = dto.ImageUrl;
            
            tutorial.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated tutorial with ID: {TutorialId}", id);

            return Ok(new { message = "Tutorial was updated successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tutorial with ID: {TutorialId}", id);
            return StatusCode(500, new { message = $"Error updating Tutorial with id={id}" });
        }
    }

    [HttpPost("{id}/view")]
    public async Task<IActionResult> UpdateViewCount(Guid id)
    {
        try
        {
            var tutorial = await _context.Tutorials.FindAsync(id);

            if (tutorial == null)
            {
                return NotFound(new { message = $"Cannot find Tutorial with id={id}." });
            }

            tutorial.ViewCount++;
            tutorial.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "View count updated successfully.", viewCount = tutorial.ViewCount });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating view count for tutorial with ID: {TutorialId}", id);
            return StatusCode(500, new { message = $"Error updating view count for Tutorial with id={id}" });
        }
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> UpdateLikes(Guid id)
    {
        try
        {
            var tutorial = await _context.Tutorials.FindAsync(id);

            if (tutorial == null)
            {
                return NotFound(new { message = $"Cannot find Tutorial with id={id}." });
            }

            tutorial.Likes++;
            tutorial.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Likes updated successfully.", likes = tutorial.Likes });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating likes for tutorial with ID: {TutorialId}", id);
            return StatusCode(500, new { message = $"Error updating likes for Tutorial with id={id}" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTutorial(Guid id)
    {
        try
        {
            var tutorial = await _context.Tutorials.FindAsync(id);

            if (tutorial == null)
            {
                return NotFound(new { message = $"Cannot delete Tutorial with id={id}. Tutorial was not found!" });
            }

            _context.Tutorials.Remove(tutorial);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted tutorial with ID: {TutorialId}", id);

            return Ok(new { message = "Tutorial was deleted successfully!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tutorial with ID: {TutorialId}", id);
            return StatusCode(500, new { message = $"Could not delete Tutorial with id={id}" });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAllTutorials()
    {
        try
        {
            var tutorials = await _context.Tutorials.ToListAsync();
            _context.Tutorials.RemoveRange(tutorials);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted all tutorials. Count: {Count}", tutorials.Count);

            return Ok(new { message = $"{tutorials.Count} Tutorials were deleted successfully!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting all tutorials");
            return StatusCode(500, new { message = "Some error occurred while removing all tutorials." });
        }
    }

    private static TutorialResponseDto MapToResponseDto(Tutorial tutorial)
    {
        return new TutorialResponseDto
        {
            Id = tutorial.Id,
            Title = tutorial.Title,
            Description = tutorial.Description,
            Author = tutorial.Author,
            Category = tutorial.Category,
            Published = tutorial.Published,
            ReadTime = tutorial.ReadTime,
            Difficulty = tutorial.Difficulty,
            Tags = tutorial.Tags,
            ImageUrl = tutorial.ImageUrl,
            ViewCount = tutorial.ViewCount,
            Likes = tutorial.Likes,
            CreatedAt = tutorial.CreatedAt,
            UpdatedAt = tutorial.UpdatedAt
        };
    }
}
