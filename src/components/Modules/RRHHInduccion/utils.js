export function fmt(val, fallback = '—') {
    return val === null || val === undefined || val === '' ? fallback : val;
}

// Las fechas llegan del backend como texto 'YYYY-MM-DD' (sin zona horaria).
export function fmtFecha(fecha) {
    if (!fecha) return '—';
    const [anio, mes, dia] = fecha.substring(0, 10).split('-');
    return `${dia}/${mes}/${anio}`;
}

export function fmtFechaHora(timestamp) {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

function hoyISO() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// Orden del roadmap: cronológico por fecha y horario; las que no tienen fecha van al final
// respetando el orden configurado por RRHH.
export function ordenarCronologico(items) {
    return [...items].sort((a, b) => {
        const claveA = a.fecha ? `${a.fecha} ${a.horario || '99:99'}` : null;
        const claveB = b.fecha ? `${b.fecha} ${b.horario || '99:99'}` : null;
        if (claveA && claveB && claveA !== claveB) return claveA < claveB ? -1 : 1;
        if (claveA && !claveB) return -1;
        if (!claveA && claveB) return 1;
        return a.orden - b.orden;
    });
}

// 'completada' | 'hoy' | 'vencida' | 'pendiente'
export function estadoItem(item) {
    if (item.completada) return 'completada';
    if (!item.fecha) return 'pendiente';
    const hoy = hoyISO();
    if (item.fecha === hoy) return 'hoy';
    return item.fecha < hoy ? 'vencida' : 'pendiente';
}

export const ESTADOS_ITEM = {
    completada: { label: 'Completada', className: 'item-completada' },
    hoy: { label: 'Hoy', className: 'item-hoy' },
    vencida: { label: 'Atrasada', className: 'item-vencida' },
    pendiente: { label: 'Pendiente', className: 'item-pendiente' },
};
