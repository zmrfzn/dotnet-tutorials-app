using System.ComponentModel.DataAnnotations;
using Tutorials.Models;

namespace Tutorials.DTOs;

public class CreateTutorialDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string? Description { get; set; }
    
    [StringLength(100)]
    public string? Author { get; set; }
    
    [StringLength(50)]
    public string? Category { get; set; }
    
    public bool Published { get; set; } = false;
    
    public int? ReadTime { get; set; }
    
    public DifficultyLevel? Difficulty { get; set; } = DifficultyLevel.Beginner;
    
    [StringLength(500)]
    public string? Tags { get; set; }
    
    [StringLength(500)]
    public string? ImageUrl { get; set; }
}

public class UpdateTutorialDto
{
    [StringLength(200)]
    public string? Title { get; set; }
    
    [StringLength(2000)]
    public string? Description { get; set; }
    
    [StringLength(100)]
    public string? Author { get; set; }
    
    [StringLength(50)]
    public string? Category { get; set; }
    
    public bool? Published { get; set; }
    
    public int? ReadTime { get; set; }
    
    public DifficultyLevel? Difficulty { get; set; }
    
    [StringLength(500)]
    public string? Tags { get; set; }
    
    [StringLength(500)]
    public string? ImageUrl { get; set; }
}

public class TutorialResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Author { get; set; }
    public string? Category { get; set; }
    public bool Published { get; set; }
    public int? ReadTime { get; set; }
    public DifficultyLevel? Difficulty { get; set; }
    public string? Tags { get; set; }
    public string? ImageUrl { get; set; }
    public int ViewCount { get; set; }
    public int Likes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
