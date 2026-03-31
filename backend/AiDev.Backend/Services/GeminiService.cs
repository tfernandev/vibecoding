using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AiDev.Backend.Services;

public interface IGeminiService
{
    Task<string> ExecutePromptAsync(string prompt, string? systemInstruction = null);
}

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly string _apiKey;
    private readonly string _model = "gemini-flash-latest"; // Using the model from user curl test
    private readonly ILogger<GeminiService> _logger;

    public GeminiService(HttpClient httpClient, IMemoryCache cache, IConfiguration config, ILogger<GeminiService> logger)
    {
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
        _apiKey = config["Gemini:ApiKey"] ?? "";
    }

    public async Task<string> ExecutePromptAsync(string prompt, string? systemInstruction = null)
    {
        // 1. Generate Intelligent Cache Key (Hash of system + prompt)
        var cacheKeyPayload = $"{systemInstruction}|{prompt}";
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(cacheKeyPayload));
        var cacheKey = $"AiPrompt_{Convert.ToBase64String(hashBytes)}";

        // 2. Check Cache
        if (_cache.TryGetValue(cacheKey, out string? cachedResponse) && cachedResponse != null)
        {
            _logger.LogInformation("Cache Hit! Returning fast response for Prompt.");
            return cachedResponse;
        }

        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("Gemini API Key is missing. Falling back to simulated response.");
            return "[SIMULATED] Por favor, configura tu API Key de Gemini en appsettings.json para ver respuestas reales.";
        }

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new { 
                    parts = new[] { new { text = $"{systemInstruction}\n\nUSER PROMPT: {prompt}" } } 
                }
            },
            generationConfig = new {
                temperature = 0.7,
                topP = 0.95,
                topK = 64,
                maxOutputTokens = 8192
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync(url, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode) {
                _logger.LogError("Gemini API Error: {Status} - {Body}", response.StatusCode, responseBody);
                return $"Error de IA ({response.StatusCode}): {responseBody}";
            }

            using var doc = JsonDocument.Parse(responseBody);
            
            // Navigate the Gemini JSON structure: candidates[0].content.parts[0].text
            var aiText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "IA respondió con vacío.";

            // 3. Save to Cache (Keep for 24 hours)
            _cache.Set(cacheKey, aiText, TimeSpan.FromHours(24));
            
            return aiText;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception calling Gemini API");
            return $"Error de conexión: {ex.Message}";
        }
    }
}
