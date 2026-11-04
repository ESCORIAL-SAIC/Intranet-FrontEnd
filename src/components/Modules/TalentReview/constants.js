// Fases del proceso (info-prompts/talent-review-proceso-general.html).
// Las fases 2 a 4 son sesiones con RRHH, sin carga en la intranet desde este hub.
export const FASES = [
    { n: 0, titulo: 'Recolección de información', grupo: 'Talent Review' },
    { n: 1, titulo: 'Mapeo de talento', grupo: 'Talent Review' },
    { n: 2, titulo: 'Sesión de sucesión', grupo: 'Talent Review' },
    { n: 3, titulo: 'Sesión de calibración', grupo: 'Talent Review' },
    { n: 4, titulo: 'Conversaciones de carrera', grupo: 'Desarrollo de carrera' },
];

// Estado → { etiqueta, tono } para los badges. Tonos: ok | pend | prog | off
export const ESTADOS = {
    completo: { label: 'Completo', tono: 'ok' },
    cerrado: { label: 'Cerrado', tono: 'ok' },
    finalizado: { label: 'Finalizado', tono: 'ok' },
    pendiente: { label: 'Pendiente', tono: 'pend' },
    borrador: { label: 'En borrador', tono: 'prog' },
    sin_cargar: { label: 'Sin cargar', tono: 'pend' },
    sin_asignar: { label: 'Sin asignar', tono: 'off' },
    sin_ciclo: { label: 'Sin ciclo', tono: 'off' },
    no_disponible: { label: 'Próximamente', tono: 'off' },
    bloqueado: { label: 'Bloqueado', tono: 'off' },
    habilitado: { label: 'Habilitado', tono: 'prog' },
};

export const ESTADOS_OK = ['completo', 'cerrado', 'finalizado'];
