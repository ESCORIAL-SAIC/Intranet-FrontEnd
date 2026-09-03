// Estas 4 funciones deben reflejar EXACTAMENTE la misma lógica que sus equivalentes en
// intranet-api/server/server.js (bloque "OBJETIVOS ANUALES"), para que el puntaje que se ve
// en vivo mientras se carga un resultado coincida siempre con el que persiste el backend.
// El backend es la fuente autoritativa: éstas sólo dan feedback inmediato en el formulario.

export function parsearResultado(raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    const n = parseFloat(String(raw).replace(',', '.').replace('%', '').trim());
    return Number.isFinite(n) ? n : null;
}

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

export function fmt(val, fallback = '—') {
    return val === null || val === undefined || val === '' ? fallback : val;
}
