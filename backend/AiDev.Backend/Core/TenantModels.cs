using System;

namespace AiDev.Backend.Core;

public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty; // empresa.ai.dev
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public interface ITenantEntity
{
    Guid TenantId { get; set; }
}
