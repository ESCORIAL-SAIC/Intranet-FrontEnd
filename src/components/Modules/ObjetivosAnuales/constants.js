// Escala de puntaje 1-5, igual a la del maquetado de referencia
// (info-prompts/ObjetivosAnuales/objetivos-anuales-escorial.html)
export const ESCALA = [
    { score: 1, label: 'No alcanza expectativa' },
    { score: 2, label: 'Casi alcanza expectativa' },
    { score: 3, label: 'Alcanza expectativa' },
    { score: 4, label: 'Supera expectativa' },
    { score: 5, label: 'Excede expectativa' },
];

// Clase CSS del "score-pill" según el puntaje 1-5 (o 'pending' si todavía no hay resultado cargado)
export function scoreClass(puntaje) {
    if (puntaje === null || puntaje === undefined) return 'pending';
    return `s${puntaje}`;
}

export const DIRECCIONES = [
    { value: 'higher', label: 'Mayor resultado = mejor' },
    { value: 'lower', label: 'Menor resultado = mejor' },
];

// Cada pilar debe pesar entre 10% y 40%, y un registro debe tener entre 3 y 5 pilares.
export const PESO_MIN = 10;
export const PESO_MAX = 40;
export const PILARES_MIN = 3;
export const PILARES_MAX = 5;

// Etiquetas de los 5 umbrales editables (el umbral a partir del cual se alcanza ese puntaje).
export const UMBRAL_FIELD_LABELS = {
    umbral_score1: 'No alcanza',
    umbral_score2: 'Casi alcanza',
    umbral_score3: 'Alcanza',
    umbral_score4: 'Supera',
    umbral_score5: 'Excede',
};

export const PILAR_VACIO = {
    nombre: '',
    descripcion: '',
    peso: '',
    unidad: '',
    direccion: 'higher',
    umbral_score1: '',
    umbral_score2: '',
    umbral_score3: '',
    umbral_score4: '',
    umbral_score5: '',
};

export const ESTADOS = {
    borrador: { label: 'Borrador', className: 'estado-borrador' },
    publicado: { label: 'Publicado', className: 'estado-publicado' },
};
