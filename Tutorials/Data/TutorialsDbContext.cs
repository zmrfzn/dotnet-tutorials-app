using Microsoft.EntityFrameworkCore;
using Tutorials.Models;

namespace Tutorials.Data;

public class TutorialsDbContext : DbContext
{
    public TutorialsDbContext(DbContextOptions<TutorialsDbContext> options) : base(options)
    {
    }
    
    public DbSet<Tutorial> Tutorials { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Tutorial>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.Difficulty).HasConversion<string>();
        });
    }
}
