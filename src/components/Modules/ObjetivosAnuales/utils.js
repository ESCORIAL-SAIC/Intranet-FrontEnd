// Estas funciones deben reflejar EXACTAMENTE la misma lógica que sus equivalentes en
// intranet-api/server/server.js (bloque "OBJETIVOS ANUALES"), para que el puntaje que se ve
// en vivo mientras se carga un resultado coincida siempre con el que persiste el backend.
// El backend es la fuente autoritativa: éstas sólo dan feedback inmediato en el formulario.

import { PESO_MIN, PESO_MAX, PILARES_MIN, PILARES_MAX } from './constants';

export function parsearResultado(raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    const n = parseFloat(String(raw).replace(',', '.').replace('%', '').trim());
    return Number.isFinite(n) ? n : null;
}

// Nota: umbral_score1 ("No alcanza") se guarda y se puede editar como los demás umbrales,
// pero no participa de esta cuenta — el puntaje 1 sigue siendo el resultado por defecto
// cuando el resultado no alcanza el umbral del puntaje 2. Queda como referencia visual/de
// carga para el evaluador (ej. el piso esperado del pilar).
export function calcularPuntajePilarObjetivo(pilar, resultadoReal) {
    const val = parsearResultado(resultadoReal);
    if (val === null) return null;
    const alcanza = pilar.direccion === 'lower'
        ? (v, umbral) => v <= umbral
        : (v, umbral) => v >= umbral;
    if (alcanza(val, Number(pilar.umbral_score5))) return 5;
    if (alcanza(val, Number(pilar.umbral_score4))) return 4;
    if (alcanza(val, Number(pilar.umbral_score3))) return 3;
    if (alcanza(val, Number(pilar.umbral_score2))) return 2;
    return 1;
}

export function calcularPuntajeFinalObjetivos(pilares) {
    const anyScored = pilares.some(p => p.puntaje !== null && p.puntaje !== undefined);
    const completo = pilares.length > 0 && pilares.every(p => p.puntaje !== null && p.puntaje !== undefined);
    if (!anyScored) return { puntajeFinal: null, completo };
    const weightedSum = pilares.reduce((acc, p) => acc + (Number(p.puntaje) || 0) * Number(p.peso), 0);
    return { puntajeFinal: Number((weightedSum / 100).toFixed(2)), completo };
}

export function pesosPilaresValidos(pilares) {
    const suma = pilares.reduce((acc, p) => acc + Number(p.peso || 0), 0);
    return Math.abs(suma - 100) < 0.01;
}

export function sumaPesos(pilares) {
    return pilares.reduce((acc, p) => acc + Number(p.peso || 0), 0);
}

// Cada pilar solo puede pesar entre PESO_MIN y PESO_MAX % (ver constants.js).
export function pesoPilarValido(peso) {
    const n = Number(peso);
    return Number.isFinite(n) && n >= PESO_MIN && n <= PESO_MAX;
}

export function todosLosPesosEnRango(pilares) {
    return pilares.every(p => pesoPilarValido(p.peso));
}

// La cantidad de pilares de un registro debe estar entre PILARES_MIN y PILARES_MAX (ver constants.js).
export function cantidadPilaresValida(pilares) {
    return pilares.length >= PILARES_MIN && pilares.length <= PILARES_MAX;
}

// Gate combinado que usan los botones de guardar/crear: suma de pesos = 100%, cada pilar
// dentro del rango de peso permitido, y cantidad de pilares dentro del rango permitido.
export function pilaresListosParaGuardar(pilares) {
    return pesosPilaresValidos(pilares) && todosLosPesosEnRango(pilares) && cantidadPilaresValida(pilares);
}

export function fmt(val, fallback = '—') {
    return val === null || val === undefined || val === '' ? fallback : val;
}
