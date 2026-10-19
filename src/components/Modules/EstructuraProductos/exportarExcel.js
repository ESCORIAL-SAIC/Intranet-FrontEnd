// Exportación a Excel del BOM (misma planilla que generaba el BOM Viewer del Andon).
// exceljs se carga bajo demanda para no sumarlo al bundle inicial de la intranet.

const BG_HDR   = 'FF1565C0';
const BG_ODD   = 'FFF0F2F5';
const BG_EVEN  = 'FFFFFFFF';
const FG_HDR   = 'FFFFFFFF';
const FG_MAIN  = 'FF1A2332';
const FG_MUTED = 'FF6B7A8D';
const FG_AMBER = 'FFC67000';
const LEVEL_FG = { 1: 'FF1565C0', 2: 'FF2E7D32', 3: 'FFC67000', 4: 'FF6A1B9A', 5: 'FF00695C' };

const font = (argb, size = 10, bold = false) => ({ bold, color: { argb }, name: 'Calibri', size });
const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });

export async function exportarExcel({ raiz, nodes, conCostos }) {
    const { default: ExcelJS } = await import('exceljs');

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Escorial Intranet — Estructura de productos';
    wb.created = new Date();

    // ── HOJA PRINCIPAL ───────────────────────────────────────────
    const ws = wb.addWorksheet(raiz.slice(0, 31), {
        properties: { tabColor: { argb: 'FF3B82F6' } },
        views: [{ state: 'frozen', ySplit: 1 }],
    });

    const cols = [
        { header: 'Niv.',        key: 'nivel', width: 5 },
        { header: 'Código',      key: 'code',  width: 22 },
        { header: 'Descripción', key: 'desc',  width: 50 },
        { header: 'Cantidad',    key: 'qty',   width: 11 },
        { header: 'Unidad',      key: 'um',    width: 8 },
        { header: 'Padre',       key: 'padre', width: 18 },
    ];
    if (conCostos) {
        cols.push(
            { header: 'Costo unit.', key: 'cuv',   width: 14 },
            { header: 'Costo nivel', key: 'cniv',  width: 14 },
            { header: 'Costo acum.', key: 'cacum', width: 14 },
            { header: 'Moneda',      key: 'mon',   width: 8 },
        );
    }
    ws.columns = cols;

    const hdr = ws.getRow(1);
    hdr.height = 22;
    hdr.eachCell(cell => {
        cell.fill = fill(BG_HDR);
        cell.font = font(FG_HDR, 10, true);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { bottom: { style: 'medium', color: { argb: 'FF0D47A1' } } };
    });

    nodes.forEach((node, i) => {
        const rd = {
            nivel: node.nivel,
            code:  '  '.repeat(node.nivel - 1) + node.code,
            desc:  node.desc,
            qty:   node.qty,
            um:    node.um,
            padre: node.padre,
        };
        if (conCostos) {
            rd.cuv   = node.cuv ?? null;
            rd.cniv  = node.cniv ?? null;
            // Costo acumulado solo en las hojas de costo, para que la suma de la columna = total
            rd.cacum = node.isCostLeaf ? node.cacum : null;
            rd.mon   = node.mon || '';
        }

        const row = ws.addRow(rd);
        row.height = 17;
        row.eachCell({ includeEmpty: true }, cell => {
            cell.fill = fill(i % 2 === 0 ? BG_ODD : BG_EVEN);
            cell.font = font(FG_MAIN);
            cell.alignment = { vertical: 'middle' };
        });

        const cNiv = row.getCell('nivel');
        cNiv.font = font(FG_MUTED, 9);
        cNiv.alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell('code').font = font(LEVEL_FG[Math.min(node.nivel, 5)], 10, true);
        row.getCell('desc').font = font(FG_MUTED);
        const cQty = row.getCell('qty');
        cQty.numFmt = '#,##0.####';
        cQty.alignment = { horizontal: 'right', vertical: 'middle' };
        row.getCell('um').font = font(FG_MUTED, 9);
        row.getCell('padre').font = font(FG_MUTED, 9);

        if (conCostos) {
            const estiloCosto = (cell, valor, f) => {
                if (valor != null) {
                    cell.numFmt = '#,##0.00';
                    cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    cell.font = f;
                } else {
                    cell.font = font(FG_MUTED, 9);
                }
            };
            estiloCosto(row.getCell('cuv'), node.cuv, font(FG_MUTED));
            if (node.cuv == null) row.getCell('cuv').value = '—';
            estiloCosto(row.getCell('cniv'), node.cniv, font(FG_AMBER, 10, node.nivel === 1));
            if (node.cniv == null) row.getCell('cniv').value = '—';
            estiloCosto(row.getCell('cacum'), rd.cacum, font(FG_AMBER));
            row.getCell('mon').font = font(FG_MUTED, 9);
        }
    });

    const costoTotal = nodes.filter(n => n.isCostLeaf).reduce((s, n) => s + (n.cacum || 0), 0);

    if (conCostos) {
        const mon = nodes.find(n => n.mon)?.mon || '';
        ws.addRow({});
        const totRow = ws.addRow({ code: 'COSTO TOTAL PRODUCTO TERMINADO', cacum: costoTotal, mon });
        totRow.height = 22;
        totRow.eachCell({ includeEmpty: true }, cell => {
            cell.fill = fill(BG_HDR);
            cell.font = font(FG_HDR, 10, true);
            cell.alignment = { vertical: 'middle' };
            cell.border = { top: { style: 'medium', color: { argb: 'FFFFC107' } } };
        });
        totRow.getCell('code').font = font('FFFFC107', 10, true);
        const tCost = totRow.getCell('cacum');
        tCost.numFmt = '#,##0.00';
        tCost.alignment = { horizontal: 'right', vertical: 'middle' };
        tCost.font = font(FG_AMBER, 11, true);
        totRow.getCell('mon').font = font(FG_AMBER, 10, true);
    }

    ws.autoFilter = { from: 'A1', to: { row: 1, column: cols.length } };

    // ── HOJA RESUMEN ─────────────────────────────────────────────
    const wsR = wb.addWorksheet('Resumen', { properties: { tabColor: { argb: 'FF1565C0' } } });
    wsR.columns = [{ header: 'Campo', key: 'c', width: 22 }, { header: 'Valor', key: 'v', width: 20 }];
    wsR.getRow(1).eachCell(cell => {
        cell.fill = fill(BG_HDR);
        cell.font = font(FG_HDR, 10, true);
    });
    const sumData = [
        ['Producto',    raiz],
        ['Componentes', nodes.length],
        ['Niveles',     nodes.reduce((m, n) => Math.max(m, n.nivel), 0)],
    ];
    if (conCostos) {
        sumData.push(
            ['Con precio',     nodes.filter(n => n.cuv != null).length],
            ['Sin precio',     nodes.filter(n => n.cuv == null).length],
            ['Costo total PT', costoTotal],
        );
    }
    sumData.forEach(([c, v], i) => {
        const r = wsR.addRow({ c, v });
        r.eachCell(cell => {
            cell.fill = fill(i % 2 === 0 ? BG_ODD : BG_EVEN);
            cell.font = font(FG_MAIN);
        });
        if (c === 'Costo total PT') {
            r.getCell('v').numFmt = '#,##0.00';
            r.getCell('v').font = font(FG_AMBER, 11, true);
        }
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_${raiz}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
