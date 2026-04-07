using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using AiDev.Backend.Core;
using AiDev.Backend.Data;
using AiDev.Backend.Services;
using Microsoft.Extensions.Logging;

namespace AiDev.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IGeminiService _geminiService;
    private readonly AppDbContext _dbContext;
    private readonly TenantContext _tenantContext;
    private readonly ILogger<AiController> _logger;

    public AiController(IGeminiService geminiService, AppDbContext dbContext, TenantContext tenantContext, ILogger<AiController> logger)
    {
        _geminiService = geminiService;
        _dbContext = dbContext;
        _tenantContext = tenantContext;
        _logger = logger;
    }

    [HttpPost("execute")]
    public async Task<IActionResult> Execute([FromBody] AiRequest request)
    {
        if (string.IsNullOrEmpty(request.Prompt))
            return BadRequest("El prompt no puede estar vacío.");

        _logger.LogInformation("Tenant {TenantId} executes AI Prompt: {Prompt}", _tenantContext.TenantId, request.Prompt);

        try
        {
            var result = await _geminiService.ExecutePromptAsync(request.Prompt, request.SystemInstruction);
            if (result.StartsWith("Error de IA", StringComparison.Ordinal)
                || result.StartsWith("Error de conexión", StringComparison.Ordinal))
            {
                return Ok(new AiResponse { Success = false, Error = result, Response = string.Empty });
            }
            return Ok(new AiResponse { Response = result, Success = true });
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "Failed to execute AI Prompt");
            return StatusCode(500, new AiResponse { Success = false, Error = ex.Message });
        }
    }
    [HttpPost("save")]
    public async Task<IActionResult> SaveSession([FromBody] SaveAiSessionRequest request)
    {
        if (string.IsNullOrEmpty(request.OriginalPrompt) || string.IsNullOrEmpty(request.RefactoredPrompt))
            return BadRequest("Los prompts no pueden estar vacíos.");

        var session = new PromptSession
        {
            OriginalPrompt = request.OriginalPrompt,
            RefactoredPrompt = request.RefactoredPrompt
        };

        _dbContext.PromptSessions.Add(session);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Saved Prompt Session for Tenant {TenantId}", _tenantContext.TenantId);

        return Ok(new { success = true, id = session.Id });
    }
}
