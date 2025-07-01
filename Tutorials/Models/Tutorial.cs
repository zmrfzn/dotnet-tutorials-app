using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tutorials.Models;

public class Tutorial
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
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
    
    public int ViewCount { get; set; } = 0;
    
    public int Likes { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum DifficultyLevel
{
    Beginner,
    Intermediate,
    Advanced
}
