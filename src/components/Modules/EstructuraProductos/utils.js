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

// Fondo pastel de verde (0%) a rojo (100%) según el costo acumulado respecto al más caro del BOM
export function colorHeatmap(cacum, maxCacum) {
    const heat = maxCacum > 0 ? (cacum || 0) / maxCacum * 100 : 0;
    const hue = 120 - heat * 1.2;
    const sat = 65 + heat * 0.15;
    const lit = 92 - heat * 0.08;
    return `hsl(${hue}deg,${sat}%,${lit}%)`;
}

// Clasificación de modularidad según cuántos productos terminados usan el componente
export function claseModularidad(cantidadProductos) {
    if (cantidadProductos >= 5) return 'ep-mod-platform';
    if (cantidadProductos >= 2) return 'ep-mod-variant';
    return 'ep-mod-unique';
}
