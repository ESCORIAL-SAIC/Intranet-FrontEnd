// Impresión del BOM como árbol jerárquico (misma salida que el botón Imprimir del BOM Viewer del Andon).
// Abre una ventana con la estructura en formato A4 y lanza el diálogo de impresión.
import { fmtCosto, fmtCantidad, abrevUm } from './utils';

function he(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Filas en orden de árbol, con los niveles que siguen "abiertos" (tienen más hermanos abajo)
// para dibujar las líneas verticales con bordes CSS
function recolectarFilas(nodos, depth = 0, openSet = [], rows = []) {
    nodos.forEach((n, i) => {
        const last = i === nodos.length - 1;
        rows.push({ depth, openSet, last, node: n });
        if (n.children.length) {
            recolectarFilas(n.children, depth + 1, last ? openSet : [...openSet, depth], rows);
        }
    });
    return rows;
}

function renderFila(r, conCostos) {
    const n = r.node;
    const cost = conCostos && n.cniv != null ? `  ·  $ ${fmtCosto(n.cniv)} ${n.mon || ''}` : '';
    let cells = '';
    for (let d = 0; d < r.depth; d++) {
        cells += `<span class="cell${r.openSet.includes(d) ? ' vl' : ''}"></span>`;
    }
    cells += `<span class="conn${r.last ? ' last' : ''}"></span>`;
    return `<div class="bom-row">${cells}` +
        `<span class="cnt"><strong>[ ${he(n.code)} ]</strong>` +
        ` ${he(n.desc)}  ·  <strong>[ ${he(fmtCantidad(n.qty))} ${he(abrevUm(n.um))} ]</strong>${he(cost)}</span></div>`;
}

// Devuelve false si el navegador bloqueó la ventana emergente
export function imprimirBom({ codigo, descripcion, nodes, conCostos }) {
    const rowsHtml = recolectarFilas(nodes).map(r => renderFila(r, conCostos)).join('');
    const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const titulo = codigo ? `${he(codigo)}  —  ${he(descripcion)}` : 'BOM';

    const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8">
<title>BOM — ${he(codigo)}</title>
<style>
*    { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Courier New',Courier,monospace; font-size:9.5px; color:#1a2332; margin:8mm 10mm; }
h1   { font-family:Arial,sans-serif; font-size:13px; color:#1565c0; border-bottom:2px solid #1565c0; padding-bottom:4px; margin-bottom:3px; }
.sub { font-family:Arial,sans-serif; font-size:9px; color:#6b7a8d; display:block; margin-bottom:12px; }
.bom-row { display:flex; align-items:stretch; }
.cell, .conn { flex-shrink:0; width:1.4em; position:relative; }
.cell.vl::before, .conn::before { content:''; position:absolute; left:calc(50% - 1px); top:0; bottom:0; border-left:1.5px solid #aaa; }
.conn::after { content:''; position:absolute; left:50%; right:0; top:50%; border-top:1.5px solid #aaa; transform:translateY(-0.5px); }
.conn.last::before { bottom:50%; }
.cnt { flex:1; word-break:break-word; align-self:center; padding-left:3px; line-height:1.45; }
.cnt strong { font-weight:700; }
@media print { @page { size:A4 portrait; margin:8mm 10mm; } }
</style>
</head><body>
<h1>${titulo}</h1>
<span class="sub">Estructura de Producto  ·  Impreso el ${fecha}${conCostos ? '  ·  con costos' : ''}</span>
${rowsHtml}
</body></html>`;

    const w = window.open('', '_blank', 'width=1000,height=750');
    if (!w) return false;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 700);
    return true;
}
