using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tutorials.Models;

public class Category
{
    [Key]
    public int Id { get; set; } = 1;
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
}

