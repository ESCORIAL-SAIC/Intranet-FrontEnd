// Preguntas y opciones tomadas de los maquetados de referencia
// (info-prompts/RRHHFormularios/Formulario Riesgo-Impacto de Pérdida.html,
//  info-prompts/RRHHFormularios/Guia de Potencial.html), sin la sección "Análisis de la IA".
//
// IMPORTANTE: los códigos (r1..r8, i1..i7, agilidad_aprendizaje/ambicion_proyeccion/influencia_emergente)
// deben reflejar exactamente RIESGO_CODES / IMPACTO_CODES / DIMENSION_CODES en
// intranet-api/server/modules/rrhh-formularios/rrhh-formularios.routes.js — el backend valida
// completitud contra esa misma lista antes de permitir finalizar un registro.

// tier: 'senal' (señal de riesgo/impacto alto), 'neutral', 'ok' (baja señal)
export const RIESGO_PREGUNTAS = [
    {
        codigo: 'r1',
        texto: '¿La persona expresó insatisfacción con su rol, compensación o perspectivas en los últimos 6 meses?',
        opciones: [
            { id: 'r1_1', label: 'Sí, directamente', tier: 'senal' },
            { id: 'r1_2', label: 'Señales indirectas', tier: 'neutral' },
            { id: 'r1_3', label: 'No, está conforme', tier: 'ok' },
        ],
    },
    {
        codigo: 'r2',
        texto: '¿Hay indicios de que esté explorando oportunidades en el mercado?',
        nota: 'Incluye señales como Open to Work activo en LinkedIn, comentarios sobre otras empresas, o cambios en su comportamiento online.',
        opciones: [
            { id: 'r2_1', label: 'Sí — Open to Work u otras señales claras', tier: 'senal' },
            { id: 'r2_2', label: 'Hay indicios, no confirmados', tier: 'neutral' },
            { id: 'r2_3', label: 'No hay indicios', tier: 'ok' },
        ],
    },
    {
        codigo: 'r3',
        texto: '¿Hubo cambios notorios en su nivel de compromiso o energía en los últimos 6 meses?',
        opciones: [
            { id: 'r3_1', label: 'Sí, a la baja', tier: 'senal' },
            { id: 'r3_2', label: 'Sin cambios visibles', tier: 'neutral' },
            { id: 'r3_3', label: 'Mejoró', tier: 'ok' },
        ],
    },
    {
        codigo: 'r4',
        texto: '¿Ha expresado inquietudes sobre su remuneración, crecimiento o reconocimiento?',
        nota: 'Incluye conversaciones directas con el líder o comentarios recurrentes con pares.',
        opciones: [
            { id: 'r4_1', label: 'Sí, inquietudes concretas', tier: 'senal' },
            { id: 'r4_2', label: 'Señales indirectas', tier: 'neutral' },
            { id: 'r4_3', label: 'No ha expresado inquietudes', tier: 'ok' },
        ],
    },
    {
        codigo: 'r5',
        texto: '¿Cuánto tiempo lleva en el mismo rol sin un cambio, expansión o promoción significativa?',
        opciones: [
            { id: 'r5_1', label: 'Menos de 1 año', tier: 'ok' },
            { id: 'r5_2', label: '1 a 3 años', tier: 'neutral' },
            { id: 'r5_3', label: 'Más de 3 años', tier: 'senal' },
        ],
    },
    {
        codigo: 'r6',
        texto: '¿Cómo es hoy el vínculo de esta persona con su equipo y con vos como líder?',
        nota: 'Evaluar cambios recientes en la dinámica, nivel de apertura, confianza y colaboración.',
        opciones: [
            { id: 'r6_1', label: 'Distante o deteriorado', tier: 'senal' },
            { id: 'r6_2', label: 'Normal, sin cambios', tier: 'neutral' },
            { id: 'r6_3', label: 'Sólido y positivo', tier: 'ok' },
        ],
    },
    {
        codigo: 'r7',
        texto: '¿Hay factores personales o de contexto que puedan afectar su continuidad en Escorial?',
        nota: 'Cambios de vida, situación geográfica, proyecto personal, etc.',
        opciones: [
            { id: 'r7_1', label: 'Sí, factores relevantes', tier: 'senal' },
            { id: 'r7_2', label: 'Posiblemente', tier: 'neutral' },
            { id: 'r7_3', label: 'No / No lo sé', tier: 'ok' },
        ],
    },
    {
        codigo: 'r8',
        texto: 'En tu opinión, basado en todo lo que observaste, ¿esta persona está evaluando irse de Escorial?',
        opciones: [
            { id: 'r8_1', label: 'Probablemente sí', tier: 'senal' },
            { id: 'r8_2', label: 'No lo sé', tier: 'neutral' },
            { id: 'r8_3', label: 'No lo creo', tier: 'ok' },
        ],
    },
];

export const IMPACTO_PREGUNTAS = [
    {
        codigo: 'i1',
        texto: '¿Hay conocimiento crítico de proceso, técnico o relacional concentrado en esta persona que no está documentado?',
        opciones: [
            { id: 'i1_1', label: 'Sí, mucho', tier: 'senal' },
            { id: 'i1_2', label: 'Algo', tier: 'neutral' },
            { id: 'i1_3', label: 'No / Está documentado', tier: 'ok' },
        ],
    },
    {
        codigo: 'i2',
        texto: '¿Cuánto tiempo estimás que llevaría que un reemplazo alcance el nivel de desempeño actual?',
        opciones: [
            { id: 'i2_1', label: 'Menos de 3 meses', tier: 'ok' },
            { id: 'i2_2', label: '3 a 6 meses', tier: 'neutral' },
            { id: 'i2_3', label: '6 a 12 meses', tier: 'senal' },
            { id: 'i2_4', label: 'Más de 12 meses', tier: 'senal' },
        ],
    },
    {
        codigo: 'i3',
        texto: '¿Qué tan disponible está ese perfil en el mercado laboral?',
        opciones: [
            { id: 'i3_1', label: 'Muy escaso', tier: 'senal' },
            { id: 'i3_2', label: 'Limitado', tier: 'neutral' },
            { id: 'i3_3', label: 'Disponible', tier: 'ok' },
        ],
    },
    {
        codigo: 'i4',
        texto: '¿Cuántos procesos clave o decisiones importantes dependen directamente de esta persona?',
        opciones: [
            { id: 'i4_1', label: 'Muchos — es un nodo crítico', tier: 'senal' },
            { id: 'i4_2', label: 'Algunos', tier: 'neutral' },
            { id: 'i4_3', label: 'Pocos', tier: 'ok' },
        ],
    },
    {
        codigo: 'i5',
        texto: '¿Tiene relaciones clave con clientes internos, externos, proveedores u otras áreas difíciles de transferir?',
        opciones: [
            { id: 'i5_1', label: 'Sí, vínculos clave', tier: 'senal' },
            { id: 'i5_2', label: 'Algunos', tier: 'neutral' },
            { id: 'i5_3', label: 'No especialmente', tier: 'ok' },
        ],
    },
    {
        codigo: 'i6',
        texto: '¿Es un sucesor identificado para algún puesto crítico de la organización?',
        opciones: [
            { id: 'i6_1', label: 'Sí, sucesor clave', tier: 'senal' },
            { id: 'i6_2', label: 'Candidato potencial', tier: 'neutral' },
            { id: 'i6_3', label: 'No', tier: 'ok' },
        ],
    },
    {
        codigo: 'i7',
        texto: '¿Qué porcentaje del output del área se vería afectado de manera inmediata si esta persona se fuera hoy?',
        opciones: [
            { id: 'i7_1', label: 'Más del 50%', tier: 'senal' },
            { id: 'i7_2', label: '25% a 50%', tier: 'senal' },
            { id: 'i7_3', label: '10% a 25%', tier: 'neutral' },
            { id: 'i7_4', label: 'Menos del 10%', tier: 'ok' },
        ],
    },
];

export const RIESGO_CODES = RIESGO_PREGUNTAS.map(p => p.codigo);
export const IMPACTO_CODES = IMPACTO_PREGUNTAS.map(p => p.codigo);

export const DIMENSIONES_POTENCIAL = [
    {
        codigo: 'agilidad_aprendizaje',
        titulo: 'Agilidad de aprendizaje',
        subtitulo: 'Velocidad y profundidad con la que incorpora experiencias nuevas y las transfiere a otros contextos',
        descriptores: {
            bajo: 'Repite los mismos enfoques aunque no funcionen. No incorpora feedback de manera visible. El aprendizaje queda en lo declarativo — no modifica conductas.',
            medio: 'Incorpora feedback y ajusta comportamientos. Aprende de experiencias nuevas con cierta demora. Puede transferir aprendizajes a contextos similares.',
            alto: 'Aprende rápido incluso sin precedentes. Incorpora feedback de inmediato y lo transfiere a otros contextos. Es referente de aprendizaje para el equipo.',
        },
        preguntas: [
            '¿Podés recordar una situación en la que enfrentó algo para lo que no tenía experiencia previa? ¿Cómo lo resolvió?',
            '¿Incorpora feedback de manera observable? ¿En qué situación concreto viste que cambió un comportamiento?',
            '¿Transfiere lo que aprende a otros, o lo guarda para sí mismo?',
        ],
    },
    {
        codigo: 'ambicion_proyeccion',
        titulo: 'Ambición y proyección',
        subtitulo: 'Voluntad y capacidad objetiva de asumir mayor complejidad en los próximos 18–24 meses',
        descriptores: {
            bajo: 'No expresa interés en asumir mayor complejidad. Está satisfecho en su rol actual. No hay señales de búsqueda de desafíos mayores ni conductas del nivel superior.',
            medio: 'Tiene aspiraciones de crecimiento y demuestra algunas capacidades para el nivel siguiente. Asume desafíos cuando se los proponen, pero no los busca activamente.',
            alto: 'Busca activamente mayor complejidad. Ya demuestra conductas del nivel superior de manera consistente. Tiene claridad sobre el rol al que aspira y las brechas que necesita cerrar.',
        },
        preguntas: [
            '¿Esta persona busca activamente desafíos mayores, o espera que se los den?',
            '¿Ya demuestra conductas del nivel superior al que aspira? ¿En qué situación concreto?',
            '¿Tiene claridad sobre hacia dónde quiere crecer dentro de Escorial en los próximos 2 años?',
        ],
    },
    {
        codigo: 'influencia_emergente',
        titulo: 'Influencia emergente',
        subtitulo: 'Capacidad de movilizar a otros más allá de la autoridad formal del rol actual',
        descriptores: {
            bajo: 'Su influencia se limita a la autoridad formal. No moviliza a otros más allá de la indicación directa. No genera tracción en pares ni fuera de su equipo.',
            medio: 'Influye ocasionalmente en pares o personas fuera de su equipo directo. Genera confianza en su entorno cercano. Su opinión es considerada aunque no siempre determinante.',
            alto: 'Moviliza a otros con consistencia, incluso sin autoridad formal. Es referente en su área o más allá. Su criterio trasciende su rol formal en conversaciones y decisiones.',
        },
        preguntas: [
            '¿Esta persona tiene influencia sobre pares fuera de su equipo directo? ¿En qué situaciones concretas?',
            '¿Otros buscan su opinión o criterio aunque no sea su responsabilidad formal?',
            '¿Ha liderado iniciativas o proyectos donde su autoridad era informal? ¿Cuál fue el resultado?',
        ],
    },
];

export const DIMENSION_CODES = DIMENSIONES_POTENCIAL.map(d => d.codigo);

export const RATING_OPCIONES = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
];

export const POTENCIAL_GLOBAL_OPCIONES = [
    { value: 'bajo', letra: 'B', label: 'Bajo potencial', desc: 'Sólido en rol actual. Sin proyección de crecimiento en 18-24 meses.' },
    { value: 'medio', letra: 'M', label: 'Potencial medio', desc: 'Puede crecer con desarrollo intencional. Requiere condiciones específicas.' },
    { value: 'alto', letra: 'A', label: 'Alto potencial', desc: 'Puede asumir mayor complejidad en 18-24 meses. Desarrollo acelerado recomendado.' },
];

export const PROYECCION_OPCIONES = [
    { value: 'consolidar', label: 'Consolidar en el rol actual' },
    { value: 'expansion', label: 'Expansión del rol actual' },
    { value: 'lateral', label: 'Movimiento lateral' },
    { value: 'nivel_superior', label: 'Listo para nivel superior' },
    { value: 'sucesor', label: 'Sucesor para puesto crítico' },
];

export const ESTADOS = {
    pendiente: { label: 'Pendiente', className: 'estado-pendiente' },
    borrador: { label: 'En borrador', className: 'estado-borrador' },
    finalizado: { label: 'Finalizado', className: 'estado-finalizado' },
};
