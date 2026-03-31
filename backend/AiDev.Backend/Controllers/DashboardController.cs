using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AiDev.Backend.Data;
using AiDev.Backend.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AiDev.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly TenantContext _tenantContext;

    public DashboardController(AppDbContext dbContext, TenantContext tenantContext)
    {
        _dbContext = dbContext;
        _tenantContext = tenantContext;
    }

    public class CourseModuleDto {
        public Guid id { get; set; }
        public string title { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public int order { get; set; }
        public string status { get; set; } = "NotStarted";
    }

    private static readonly List<CourseModuleDto> _staticModules = new List<CourseModuleDto> {
        new CourseModuleDto { id = new Guid("11111111-1111-1111-1111-111111111101"), title = "Fundamentos de AI Engineering", description = "Aprende los conceptos básicos de LLMs y tokens.", order = 1, status = "InProgress" },
        new CourseModuleDto { id = new Guid("11111111-1111-1111-1111-111111111102"), title = "Diseño de Prompts", description = "Estructuras eficientes para controlar el comportamiento del modelo.", order = 2, status = "InProgress" },
        new CourseModuleDto { id = new Guid("11111111-1111-1111-1111-111111111103"), title = "Prompt Patterns Pro", description = "Domina la descomposición y el encadenamiento de tareas complejas.", order = 3, status = "InProgress" },
        new CourseModuleDto { id = new Guid("11111111-1111-1111-1111-111111111104"), title = "Eficiencia y Ownership", description = "Mantén el control del código y evita la deuda técnica invisible.", order = 4, status = "InProgress" },
        new CourseModuleDto { id = new Guid("11111111-1111-1111-1111-111111111105"), title = "Validación y Testing de IA", description = "Asegura la calidad y estabilidad de las soluciones generadas por IA.", order = 5, status = "InProgress" }
    };

    [HttpGet("data")]
    public IActionResult GetDashboardData()
    {
        return Ok(new 
        {
            stats = new {
                progressPct = 25,
                sandboxSessions = 12,
                patternsMastered = 1,
                totalPatterns = 5,
                linterScore = "B+"
            },
            modules = _staticModules
        });
    }

    [HttpGet("course/{id}")]
    public IActionResult GetCourse(Guid id)
    {
        var module = _staticModules.FirstOrDefault(m => m.id == id);
        
        if (module == null)
            return NotFound();

        // Real High-Quality Vibe Coding Curriculum - Full Expansion
        var lessons = module.order switch {
            1 => new[] {
                new { title = "El paradigma del 'AI-First Developer'", completed = true, content = @"
                    <h2>Fundamentos: El cambio de paradigma</h2>
                    <p>En el <b>Vibe Coding</b>, ya no somos procesadores de sintaxis; somos <b>Directores de Intención</b>.</p>
                    <ul>
                        <li><b>Sintaxis vs Semántica:</b> ¿Por qué aprender C# ya no es suficiente?</li>
                        <li><b>La Intuición del Modelo:</b> Cómo 'sentir' si un prompt va a fallar antes de darle enter.</li>
                        <li><b>Abstracción Extrema:</b> Dejar que la IA maneje los detalles de implementación mientras tú controlas la arquitectura.</li>
                    </ul>
                    <div class='code-block-header'>Mantra Vibe Coding:</div>
                    <pre class='terminal-style'>'Describe el QUÉ, delega el CÓMO, audita el RESULTADO'</pre>" },
                new { title = "Tokens y Ventanas de Contexto", completed = false, content = @"
                    <h2>Entendiendo el cerebro de la IA</h2>
                    <p>Tu código es una secuencia de números (tokens). Optimizar esto es la clave de la eficiencia.</p>
                    <ul>
                        <li><b>Context Window:</b> Por qué saturar a la IA con archivos innecesarios mata su razonamiento.</li>
                        <li><b>Lost in the Middle:</b> El fenómeno donde la IA olvida instrucciones en el medio de prompts largos.</li>
                        <li><b>Gestión de Memoria Cognitiva:</b> Cómo usar RAG y contexto selectivo.</li>
                    </ul>" },
                new { title = "Laboratorio: Esculpiendo Intenciones", completed = false, content = @"
                    <h2>Práctica: De Idea a Arquitectura</h2>
                    <p>En este laboratorio, transformarás una idea vaga de negocio en una estructura de clases de C# usando solo lenguaje natural estructurado.</p>" }
            },
            2 => new[] {
                new { title = "El Prompt como Contrato de Ejecución", completed = true, content = @"
                    <h2>Diseño de Prompts: Arquitectura de Instrucciones</h2>
                    <p>Un prompt profesional no es una pregunta, es un **Contrato**. Debe tener claúsulas claras.</p>
                    <h3>Estructura del Contrato:</h3>
                    <ul>
                      <li><b>Persona:</b> ¿Quién es la IA? (ej: 'Actúa como un Experto en Seguridad .NET').</li>
                      <li><b>Objetivo:</b> ¿Qué debe lograr exactamente?</li>
                      <li><b>Restricciones:</b> ¿Qué tiene prohibido hacer?</li>
                      <li><b>Formato:</b> ¿Cómo debe entregar el output? (JSON, Markdown, Código?).</li>
                    </ul>" },
                new { title = "Role Prompting y Chain of Thought", completed = false, content = @"
                    <h2>Técnicas de Razonamiento Profundo</h2>
                    <p>Forzar a la IA a 'pensar en voz alta' reduce errores en un 60%.</p>
                    <p><b>Chain of Thought (CoT):</b> Pedir explicitly que desglose el problema antes de dar la solución final.</p>
                    <div class='code-block-header'>Ejemplo:</div>
                    <pre class='terminal-style'>'Antes de generar el código, analiza paso a paso las implicaciones de rendimiento...'</pre>" },
                new { title = "Eliminando la Alucinación Técnica", completed = false, content = @"
                    <h2>Negative Constraints: El arte del NO</h2>
                    <p>Aprenderás a usar palabras 'Stop' y límites de conocimiento para que la IA prefiera decir 'No sé' antes que inventar librerías que no existen.</p>" }
            },
            3 => new[] {
                new { title = "Dominio del Patrón Dual Mode", completed = true, content = @"
                    <h2>Patrón Dual Mode: Planificación vs Ejecución</h2>
                    <p>Este es el corazón del Vibe Coding para arquitectos. Obligas al modelo a separar su fase de planificación de la fase de ejecución.</p>
                    <div class='code-block-header'>Estructura Pro:</div>
                    <pre class='terminal-style'>
[INTENCIÓN]: Resolver trade-off de base de datos.
[INSTRUCCIÓN]: 
1. Analiza 3 alternativas (SQL, NoSQL, NewSQL).
2. Selecciona la mejor y justifica.
3. Solo después del paso 2, genera el código de migración.
                    </pre>" },
                new { title = "Descomposición y Encadenamiento", completed = false, content = @"
                    <h2>Chain Prompting</h2>
                    <p>No pidas todo de una vez. Aprende a encadenar prompts donde el output del paso 1 alimente al paso 2.</p>
                    <p>Ideal para refactorizaciones de sistemas legacy enteros.</p>" },
                new { title = "Laboratorio: Cursor + Architect", completed = false, content = @"
                    <h2>Práctica Real en el Editor</h2>
                    <p>Usa tu extensión de Cursor para aplicar el patrón Dual Mode en tiempo real sobre un problema de concurrrencia en C#.</p>" }
            },
            4 => new[] {
                new { title = "El Arquitecto como Tech Lead de IAs", completed = true, content = @"
                    <h2>Ownership y Responsabilidad</h2>
                    <p>El desarrollador que solo hace copy-paste está muerto. Tú eres el **dueño intelectual** de cada línea generada.</p>
                    <p>Aprenderás a mantener el 'Mental Model' de tu código mientras la IA hace el trabajo pesado.</p>" },
                new { title = "Auditoría de Deuda Técnica Generada", completed = false, content = @"
                    <h2>Detectando el 'Copilot Spaghetti'</h2>
                    <p>La IA suele tender a lo fácil, no a lo mantenible. Aprenderás patrones para detectar cuándo una IA está sugiriendo soluciones 'hacky'.</p>
                    <ul>
                        <li>Validación de Principios SOLID en código AI-gen.</li>
                        <li>Análisis de complejidad ciclomática del output.</li>
                    </ul>" },
                new { title = "Métricas de Calidad Cognitiva", completed = false, content = @"
                    <h2>¿Cómo medir lo que la IA construye?</h2>
                    <p>Aprenderás a usar herramientas de análisis estático aplicadas al output de IA para asegurar que el 'Vibe' no comprometa la 'Arquitectura'.</p>" }
            },
            5 => new[] {
                new { title = "Estrategias de Evaluación (Evals)", completed = true, content = @"
                    <h2>Validación Rigurosa: Más allá del 'Vibe'</h2>
                    <p>Un Senior Dev no confía en el primer output. Implementa sistemas de evaluación para medir la precisión de las respuestas.</p>
                    <ul>
                        <li><b>Golden Sets:</b> Cómo crear un conjunto de pruebas maestras para tus prompts.</li>
                        <li><b>Model-graded Evals:</b> Usar una IA más potente (ej: GPT-4o o Gemini 1.5 Pro) para calificar el trabajo de una IA más rápida.</li>
                        <li><b>A/B Prompting:</b> Metodologías para comparar variantes de instrucciones científicamente.</li>
                    </ul>" },
                new { title = "Unit Testing para Prompts", completed = false, content = @"
                    <h2>Integración Continua de IA</h2>
                    <p>¿Qué pasa si cambias el System Prompt y rompes 5 features? Aprende a automatizar la validación de prompts en tu pipeline de CI/CD.</p>
                    <pre class='terminal-style'>Assert.IsTrue(aiOutput.Contains('Try-Catch'), 'La IA olvidó el manejo de errores');</pre>" },
                new { title = "Laboratorio: Certificación Senior Vibe Coder", completed = false, content = @"
                    <h2>El Gran Desafío Final</h2>
                    <p>Construirás una funcionalidad completa delegando el 100% del código, pero implementando una suite de pruebas que garantice que el código cumple con los estándares senior de la empresa.</p>" }
            },
            _ => new[] {
                new { title = "Módulo Especial", completed = false, content = "<h2>Próximamente...</h2>" }
            }
        };

        return Ok(new {
            id = module.id,
            title = module.title,
            lessons = lessons
        });
    }
}
