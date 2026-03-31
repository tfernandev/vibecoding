using Microsoft.EntityFrameworkCore;
using AiDev.Backend.Core;
using AiDev.Backend.Services;
using System.Threading;
using System.Threading.Tasks;

namespace AiDev.Backend.Data;

public class AppDbContext : DbContext
{
    private readonly TenantContext _tenantContext;

    public AppDbContext(DbContextOptions<AppDbContext> options, TenantContext tenantContext)
        : base(options)
    {
        _tenantContext = tenantContext;
    }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<User> Users { get; set; } // Simplified for now
    public DbSet<PromptSession> PromptSessions { get; set; }
    public DbSet<CourseModule> CourseModules { get; set; }
    public DbSet<UserProgress> UserProgresses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global Query Filter for Multi-Tenancy
        modelBuilder.Entity<User>().HasQueryFilter(u => u.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<PromptSession>().HasQueryFilter(p => p.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<CourseModule>().HasQueryFilter(m => m.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<UserProgress>().HasQueryFilter(u => u.TenantId == _tenantContext.TenantId);
        
        // Ensure Tenant slugs are unique
        modelBuilder.Entity<Tenant>().HasIndex(t => t.Slug).IsUnique();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<ITenantEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                if (_tenantContext.TenantId.HasValue)
                {
                    entry.Entity.TenantId = _tenantContext.TenantId.Value;
                }
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}

public class User : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class PromptSession : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string OriginalPrompt { get; set; } = string.Empty;
    public string RefactoredPrompt { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CourseModule : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UserProgress : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid ModuleId { get; set; }
    public string Status { get; set; } = "NotStarted"; // NotStarted, InProgress, Completed
}
