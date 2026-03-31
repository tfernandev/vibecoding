using Microsoft.AspNetCore.Mvc;
using AiDev.Backend.Services;

namespace AiDev.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DebugController : ControllerBase
{
    private readonly TenantContext _tenantContext;

    public DebugController(TenantContext tenantContext)
    {
        _tenantContext = tenantContext;
    }

    [HttpGet("tenant")]
    public IActionResult GetTenantInfo()
    {
        return Ok(new
        {
            Status = "Success",
            Message = "Infrastructure is online.",
            TenantInfo = new {
                Id = _tenantContext.TenantId,
                Slug = _tenantContext.TenantSlug
            }
        });
    }
}
