export interface LintResult {
  score: number; // 0 to 100
  feedback: {
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    category: 'role' | 'context' | 'task' | 'constraints' | 'output' | 'clarity';
  }[];
}

export function analyzePrompt(prompt: string): LintResult {
  const feedback: LintResult['feedback'] = [];
  const lowerPrompt = prompt.toLowerCase();

  // 1. Check for ROLE
  const roleKeywords = ['eres', 'actúa como', 'perfil', 'como un', 'as a', 'role', 'expert', 'senior', 'architect'];
  const hasRole = roleKeywords.some(k => lowerPrompt.includes(k));
  
  if (!hasRole) {
    feedback.push({
      type: 'warning',
      category: 'role',
      message: 'Falta definición de rol. Especificá quién debe ser la IA (ej. "Actúa como un Arquitecto .NET Senior").'
    });
  } else {
    feedback.push({
      type: 'success',
      category: 'role',
      message: 'Rol detectado ✅'
    });
  }

  // 2. Check for CONTEXT
  const contextLength = prompt.split(' ').length;
  if (contextLength < 15) {
    feedback.push({
      type: 'error',
      category: 'context',
      message: 'Contexto insuficiente. Los prompts cortos suelen dar resultados genéricos. Agregá detalles del sistema.'
    });
  } else {
    feedback.push({
      type: 'success',
      category: 'context',
      message: 'Longitud de contexto adecuada.'
    });
  }

  // 3. Check for TASK
  const taskKeywords = ['tarea', 'objetivo', 'necesito', 'escribí', 'creá', 'task', 'goal', 'write', 'create', 'generate'];
  const hasTask = taskKeywords.some(k => lowerPrompt.includes(k));
  if (!hasTask) {
    feedback.push({
      type: 'warning',
      category: 'task',
      message: 'La tarea no parece estar explícita. Usá verbos de acción claros.'
    });
  }

  // 4. Check for CONSTRAINTS
  const constraintKeywords = ['restricciones', 'límites', 'no uses', 'máximo', 'constraints', 'limits', 'don\'t use', 'avoid', 'mandatory'];
  const hasConstraints = constraintKeywords.some(k => lowerPrompt.includes(k));
  if (!hasConstraints) {
    feedback.push({
      type: 'info',
      category: 'constraints',
      message: 'Tip: Agregar restricciones (ej. "no uses librerías externas") mejora mucho la precisión.'
    });
  }

  // 5. Check for OUTPUT FORMAT
  const outputKeywords = ['json', 'tabla', 'table', 'markdown', 'lista', 'list', 'output', 'formato'];
  const hasOutput = outputKeywords.some(k => lowerPrompt.includes(k));
  if (!hasOutput) {
    feedback.push({
      type: 'warning',
      category: 'output',
      message: 'No se detectó formato de salida. Definí si querés JSON, una tabla o Markdown.'
    });
  }

  // Calculate score
  let score = 20; // Base
  if (hasRole) score += 20;
  if (contextLength > 20) score += 20;
  if (hasTask) score += 20;
  if (hasConstraints) score += 10;
  if (hasOutput) score += 10;

  return {
    score: Math.min(score, 100),
    feedback
  };
}
