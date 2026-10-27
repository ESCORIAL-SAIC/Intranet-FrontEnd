import { RIESGO_CODES, IMPACTO_CODES, DIMENSION_CODES } from './constants';

export function fmt(val, fallback = '—') {
    return val === null || val === undefined || val === '' ? fallback : val;
}

// El backend valida esta misma completitud antes de permitir finalizar (ver
// respuestasCompletas/dimensionesCompletas en rrhh-formularios.routes.js).
export function respuestasCompletas(respuestas, codes) {
    return codes.every(c => respuestas && typeof respuestas[c] === 'string' && respuestas[c].length > 0);
}

export function riesgoImpactoCompleto(respuestasRiesgo, respuestasImpacto) {
    return respuestasCompletas(respuestasRiesgo, RIESGO_CODES) && respuestasCompletas(respuestasImpacto, IMPACTO_CODES);
}

export function dimensionesCompletas(dimensiones) {
    return DIMENSION_CODES.every(c => dimensiones && dimensiones[c] && ['bajo', 'medio', 'alto'].includes(dimensiones[c].rating));
}

export function guiaPotencialCompleta(dimensiones, potencialGlobal) {
    return dimensionesCompletas(dimensiones) && !!potencialGlobal;
}
