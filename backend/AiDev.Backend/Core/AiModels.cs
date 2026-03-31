using System;

namespace AiDev.Backend.Core;

public class AiRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string SystemInstruction { get; set; } = "Eres un Arquitecto de Software Senior y experto en Ingeniería de IA.";
}

public class AiResponse
{
    public string Response { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class SaveAiSessionRequest
{
    public string OriginalPrompt { get; set; } = string.Empty;
    public string RefactoredPrompt { get; set; } = string.Empty;
}
