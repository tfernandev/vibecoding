using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using AiDev.Backend.Services;
using System.Linq;
using System;

namespace AiDev.Backend.Middleware;

public class TenantResolverMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolverMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext)
    {
        // For development, we look for X-Tenant header
        // In production, we would parse context.Request.Host
        if (context.Request.Headers.TryGetValue("X-Tenant", out var tenantSlug))
        {
            // Simplified: In a real app, you would look this up in the DB
            // and cache it. For now, we'll simulate a resolution.
            var slug = tenantSlug.ToString();
            
            // Temporary mapping for testing
            Guid mockId = slug switch {
                "google" => new Guid("11111111-1111-1111-1111-111111111111"),
                "globant" => new Guid("22222222-2222-2222-2222-222222222222"),
                _ => Guid.Empty
            };

            if (mockId != Guid.Empty)
            {
                tenantContext.SetTenant(mockId, slug);
            }
        }

        await _next(context);
    }
}
