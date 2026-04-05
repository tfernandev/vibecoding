/**
 * AI Service - Real Integration Layer
 * Now Proxying through our .NET Backend!
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5054/api';

const ADVANCED_SYSTEM_PROMPT = `Eres un "Prompt Architect" de Élite y Tech Lead.
Tu ÚNICO propósito en el universo es recibir peticiones básicas de los usuarios y REFACTORIZARLAS en Mega-Prompts de Ingeniería de altísima calidad.

<reglas_estrictas>
1. PROHIBIDO ESCRIBIR CÓDIGO FINAL DE LA SOLUCIÓN. 
2. PROHIBIDO RESOLVER LA PETICIÓN DEL USUARIO. 
3. SOLO DEBES MEJORAR EL PROMPT ORIGINAL.
</reglas_estrictas>

<ejemplo_de_funcionamiento>
Usuario: "haz un login en react"
Tú:
### 🛠️ Análisis de tu Prompt
Tu prompt era muy básico. No definía arquitectura, manejo de estado, ni seguridad (JWT).

### 🚀 Prompt Refactorizado (Copia y Pega este texto en otra IA)
\`\`\`text
Actúa como un Tech Lead en React.
Necesito implementar un sistema de Login.
Restricciones y Contexto:
- Usa TypeScript y Clean Architecture (separando Lógica de Ui).
- Manejo de formularios con react-hook-form y zod.
- Autenticación segura vía JWT guardado en HttpOnly Cookies.
- Crea el AuthContext y el AuthGuard para proteger rutas.
Por favor, genera únicamente la estructura de carpetas y los contratos de tipos primero.
\`\`\`
</ejemplo_de_funcionamiento>

SIGUE ESTE FORMATO ESTRICTAMENTE. TU TRABAJO EMPIEZA AHORA CON EL SIGUIENTE PROMPT.`;

export async function sendMessage(prompt: string, signal?: AbortSignal) {
  try {
    const response = await fetch(`${API_BASE_URL}/Ai/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant': 'google' // Simulate a resolved tenant
      },
      body: JSON.stringify({ 
        prompt,
        systemInstruction: ADVANCED_SYSTEM_PROMPT
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        data: data.response
      };
    } else {
      throw new Error(data.error || "Error desconocido");
    }
  } catch (error: any) {
    if (error.name === 'AbortError') return { success: false, data: "Petición cancelada." };
    console.error("Error in AI Service Call:", error);
    throw error;
  }
}

export async function saveSession(originalPrompt: string, refactoredPrompt: string, signal?: AbortSignal) {
  try {
    const response = await fetch(`${API_BASE_URL}/Ai/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant': 'google'
      },
      body: JSON.stringify({ 
        originalPrompt,
        refactoredPrompt
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Error guardando sesión: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') return { success: false, data: "Cancelado" };
    console.error("Error saving session:", error);
    throw error;
  }
}

export async function checkBackendStatus() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 6000); // 6s timeout for Render wake up

    const response = await fetch(`${API_BASE_URL}/Debug/tenant`, {
      method: "GET",
      headers: {
        "X-Tenant": "google"
      },
      signal: controller.signal
    });
    
    clearTimeout(id);
    return response.ok;
  } catch (error) {
    console.warn("Backend status check failed:", error);
    return false;
  }
}
