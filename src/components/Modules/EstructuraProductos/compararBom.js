// Comparación de dos BOM (pestaña Comparar del BOM Viewer de AndonLineasProduccion).
// Por código de componente se suma la cantidad acumulada desde la raíz en cada BOM y se clasifica:
// solo en A, solo en B, cantidad distinta o igual.
import { descargarXlsx } from './exportarExcel';

const TOLERANCIA_QTY = 0.0001;

function cantidadesPorCodigo(rows) {
    const m = new Map();
    for (const r of rows) {
        const qty = parseFloat(r.qty_acum) || 0;
        if (m.has(r.hijo)) m.get(r.hijo).qty += qty;
        else m.set(r.hijo, { qty, desc: r.descripcion, um: r.unidadmedida });
    }
    return m;
}

// Map código → { inA, inB, qtyA, qtyB, equal, desc, um }
export function calcularDiferencias(rowsA, rowsB) {
    const mA = cantidadesPorCodigo(rowsA);
    const mB = cantidadesPorCodigo(rowsB);
    const diff = new Map();
    for (const [code, a] of mA) {
        const b = mB.get(code);
        diff.set(code, {
            inA: true, inB: !!b, qtyA: a.qty, qtyB: b ? b.qty : 0,
            equal: !!b && Math.abs(a.qty - b.qty) < TOLERANCIA_QTY,
            desc: a.desc, um: a.um,
        });
    }
    for (const [code, b] of mB) {
        if (!diff.has(code)) diff.set(code, { inA: false, inB: true, qtyA: 0, qtyB: b.qty, equal: false, desc: b.desc, um: b.um });
    }
    return diff;
}

// 'solo-a' | 'solo-b' | 'qty' | 'igual' para un código visto desde el lado slot ('a' o 'b')
export function estadoDiferencia(diff, code, slot) {
    const d = diff.get(code);
    if (!d) return 'igual';
    if (d.inA && d.inB) return d.equal ? 'igual' : 'qty';
    return slot === 'a' ? 'solo-a' : 'solo-b';
}

// Códigos de los nodos de un árbol que son distintos o tienen algún descendiente distinto
// (con "Solo diferencias" se ocultan los iguales que no tienen diferencias abajo)
export function nodosConDiferencias(tree, diff, slot) {
    const ids = new Set();
    const visitar = (n) => {
        let tiene = estadoDiferencia(diff, n.code, slot) !== 'igual';
        for (const c of n.children) if (visitar(c)) tiene = true;
        if (tiene) ids.add(n.id);
        return tiene;
    };
    tree.forEach(visitar);
    return ids;
}

export function resumenDiferencias(diff) {
    const r = { soloA: 0, soloB: 0, qty: 0, igual: 0 };
    for (const d of diff.values()) {
        if (d.inA && !d.inB) r.soloA++;
        else if (!d.inA && d.inB) r.soloB++;
        else if (d.equal) r.igual++;
        else r.qty++;
    }
    r.distintos = r.soloA + r.soloB + r.qty;
    return r;
}

// Excel de la comparación: una fila por código, ordenadas solo A → cant. distinta → solo B → igual
export async function exportarComparacionExcel({ codigoA, codigoB, diff }) {
    const { default: ExcelJS } = await import('exceljs');
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Comparación BOM');
    const cA = codigoA || 'A';
    const cB = codigoB || 'B';
    const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
    const ESTADOS = {
        soloA: { texto: 'Solo en A', orden: 0, fill: fill('FFE8F5E9') },
        qty:   { texto: 'Cant. distinta', orden: 1, fill: fill('FFFFF8E1') },
        soloB: { texto: 'Solo en B', orden: 2, fill: fill('FFFCE4EC') },
        igual: { texto: 'Igual', orden: 3, fill: fill('FFFAFAFA') },
    };

    ws.columns = [
        { header: 'Código', key: 'code', width: 18 },
        { header: 'Descripción', key: 'desc', width: 40 },
        { header: 'UM', key: 'um', width: 8 },
        { header: `Cant. ${cA}`, key: 'qtyA', width: 14 },
        { header: `Cant. ${cB}`, key: 'qtyB', width: 14 },
        { header: 'Diferencia', key: 'diff', width: 14 },
        { header: 'Estado', key: 'estado', width: 22 },
    ];
    ws.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FF1565C0' } };
        cell.fill = fill('FFE3F0FF');
        cell.border = { bottom: { style: 'medium', color: { argb: 'FF1565C0' } } };
    });

    const filas = [...diff].map(([code, d]) => {
        const estado = d.inA && !d.inB ? ESTADOS.soloA : !d.inA && d.inB ? ESTADOS.soloB : d.equal ? ESTADOS.igual : ESTADOS.qty;
        const qtyA = d.inA ? d.qtyA : null;
        const qtyB = d.inB ? d.qtyB : null;
        return { code, d, estado, qtyA, qtyB, diferencia: qtyA != null && qtyB != null ? qtyB - qtyA : null };
    }).sort((x, y) => x.estado.orden - y.estado.orden || x.code.localeCompare(y.code));

    for (const f of filas) {
        const row = ws.addRow({
            code: f.code, desc: f.d.desc || '', um: f.d.um || '',
            qtyA: f.qtyA ?? '—', qtyB: f.qtyB ?? '—', diff: f.diferencia ?? '—',
            estado: f.estado.texto,
        });
        row.eachCell(cell => { cell.fill = f.estado.fill; });
        ['qtyA', 'qtyB', 'diff'].forEach(k => {
            const cell = row.getCell(k);
            cell.alignment = { horizontal: 'right' };
            if (typeof cell.value === 'number') cell.numFmt = '#,##0.####';
        });
    }

    ws.addRow([]);
    const sumRow = ws.addRow(['', `BOM A: ${cA}`, '', `BOM B: ${cB}`]);
    sumRow.getCell(2).font = { bold: true, color: { argb: 'FF2E7D32' } };
    sumRow.getCell(4).font = { bold: true, color: { argb: 'FFC62828' } };

    await descargarXlsx(wb, `Comparacion_${cA}_vs_${cB}.xlsx`);
}
