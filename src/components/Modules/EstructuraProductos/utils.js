// Lógica del BOM Viewer de AndonLineasProduccion (files/bom_viewer.html), sin DOM.

// Arma el árbol a partir de las filas planas que devuelve /estructura-productos/estructura
// (ordenadas por ruta, así que cada fila cuelga del último nodo abierto del nivel anterior).
export function buildTree(rows) {
    const root = { children: [] };
    const stack = [root];
    const nodeMap = new Map();
    let nodeId = 0;
    for (const row of rows) {
        const node = {
            id:    ++nodeId,
            nivel: row.nivel,
            padre: row.padre,
            code:  row.hijo,
            desc:  row.descripcion,
            qty:   row.cantidad,
            um:    row.unidadmedida,
            qty_acum: row.qty_acum,
            cuv:   row.costo_unitario,   // costo unitario (lista de precios)
            cniv:  row.costo_nivel,      // cuv × cantidad del nivel
            cacum: row.costo_acumulado,  // cuv × cantidad acumulada desde la raíz
            mon:   row.moneda,
            cuv_usd:    row.costo_unitario_usd,   // dolarizados con la cotización del día del precio
            cniv_usd:   row.costo_nivel_usd,
            cacum_usd:  row.costo_acumulado_usd,
            cotizacion: row.cotizacion_usd,       // pesos por dólar usados para dolarizar
            fecha_precio: row.fecha_precio,       // 'YYYY-MM-DD' de la última modificación del precio
            children: [],
        };
        nodeMap.set(node.id, node);
        while (stack.length > row.nivel) stack.pop();
        stack[stack.length - 1].children.push(node);
        stack.push(node);
    }
    marcarHojasCosto(root.children);
    return { tree: root.children, nodeMap };
}

// Si un nodo tiene precio propio se usa directamente aunque tenga hijos (el BOM del
// sub-ensamble es informativo; su costo es su precio de compra). Solo recursa si no tiene precio.
export function costoHojas(nodos) {
    let s = 0;
    for (const n of nodos) {
        if (n.cacum != null) s += n.cacum;
        else s += costoHojas(n.children);
    }
    return s;
}

// Marca n.isCostLeaf en los nodos que aportan al total: el primer nodo con precio en cada
// rama descendente. Los sub-componentes de un nodo costeable no se suman.
function marcarHojasCosto(nodos, ancestroCosteable = false) {
    for (const n of nodos) {
        n.isCostLeaf = n.cacum != null && !ancestroCosteable;
        marcarHojasCosto(n.children, ancestroCosteable || n.cacum != null);
    }
}

export function flattenNode(node, rows = []) {
    rows.push(node);
    for (const c of node.children) flattenNode(c, rows);
    return rows;
}

export function idsConHijos(nodos, ids = []) {
    for (const n of nodos) {
        if (n.children.length) {
            ids.push(n.id);
            idsConHijos(n.children, ids);
        }
    }
    return ids;
}

export function fmtCosto(v) {
    if (v == null) return '—';
    return v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtCantidad(q) {
    return q % 1 === 0 ? q.toFixed(0) : q.toFixed(4).replace(/\.?0+$/, '');
}

// Total en USD: misma regla que costoHojas, sumando el costo acumulado dolarizado de las hojas de costo
export function costoHojasUSD(nodos) {
    let s = 0;
    for (const n of nodos) {
        if (n.isCostLeaf) s += n.cacum_usd || 0;
        else s += costoHojasUSD(n.children);
    }
    return s;
}

// Clasificación ABC (Pareto 80/20): ordena las hojas de costo por costo acumulado de mayor a menor
// y marca como clase A las que completan el primer 80% del costo total. El resto es B/C.
export function calcularPareto(nodeMap) {
    const hojas = [...nodeMap.values()]
        .filter(n => n.isCostLeaf && n.cacum != null && n.cacum > 0)
        .sort((a, b) => b.cacum - a.cacum);
    const total = hojas.reduce((s, n) => s + n.cacum, 0);
    const claseA = new Set();
    let acumA = 0;
    for (const n of hojas) {
        acumA += n.cacum;
        claseA.add(n.id);
        if (total > 0 && acumA >= total * 0.8) break;
    }
    return { claseA, acumA, total, moneda: hojas[0]?.mon || '' };
}

// Texto "Cotiz. $X | dd/mm/aaaa" (o rangos) con las cotizaciones y fechas usadas en las hojas de costo
export function resumenCotizacion(nodeMap) {
    const hojas = [...nodeMap.values()].filter(n => n.isCostLeaf && n.cotizacion != null);
    if (!hojas.length) return '';
    const cotiz = [...new Set(hojas.map(n => n.cotizacion))].sort((a, b) => a - b);
    const fechas = [...new Set(hojas.map(n => n.fecha_precio).filter(Boolean))].sort();
    const fmtFecha = fmtFechaPrecio;
    const cotizTxt = cotiz.length === 1
        ? `$${fmtCosto(cotiz[0])}`
        : `$${fmtCosto(cotiz[0])} – $${fmtCosto(cotiz[cotiz.length - 1])}`;
    const fechaTxt = fechas.length > 1
        ? `${fmtFecha(fechas[0])} – ${fmtFecha(fechas[fechas.length - 1])}`
        : fmtFecha(fechas[0]);
    return `Cotiz. ${cotizTxt} | ${fechaTxt}`;
}

export function fmtFechaPrecio(f) {
    return f ? f.split('-').reverse().join('/') : '';
}

// Clasificación de modularidad según cuántos productos terminados usan el componente
export function claseModularidad(cantidadProductos) {
    if (cantidadProductos >= 5) return 'ep-mod-platform';
    if (cantidadProductos >= 2) return 'ep-mod-variant';
    return 'ep-mod-unique';
}
