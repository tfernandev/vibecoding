using System;

namespace AiDev.Backend.Services;

public class TenantContext
{
    public Guid? TenantId { get; set; }
    public string? TenantSlug { get; set; }

    public void SetTenant(Guid id, string slug)
    {
        TenantId = id;
        TenantSlug = slug;
    }
}
