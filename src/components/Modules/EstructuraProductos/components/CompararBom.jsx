import { useState, useMemo, useRef } from 'react';
import axios from 'axios';

import BuscadorProductos from './BuscadorProductos';
import { buildTree, fmtCantidad, abrevUm } from '../utils';
import { calcularDiferencias, estadoDiferencia, nodosConDiferencias, resumenDiferencias, exportarComparacionExcel } from '../compararBom';

const SLOT_VACIO = { codigo: '', descripcion: '', rows: [], cargando: false, error: null };

// Indicador de cada fila según el estado de la diferencia
function PuntoDiferencia({ estado, otraCantidad, um }) {
    if (estado === 'solo-a') return <span className="ep-diff-dot ep-dot-a" title="Solo en este BOM">●</span>;
    if (estado === 'solo-b') return <span className="ep-diff-dot ep-dot-b" title="Solo en este BOM">●</span>;
    if (estado === 'qty') return <span className="ep-diff-dot ep-dot-qty" title={`Cant. distinta · otro BOM: ${otraCantidad} ${um || ''}`}>▲</span>;
    return <span className="ep-diff-dot ep-dot-eq">·</span>;
}

function NodoComparado({ node, ctx }) {
    const { slot, diff, conDiferencias, soloDiferencias, collapsed, toggle } = ctx;
    const estado = estadoDiferencia(diff, node.code, slot);
    if (soloDiferencias && estado === 'igual' && !conDiferencias.has(node.id)) return null;
    const d = diff.get(node.code);
    const otraCantidad = fmtCantidad(slot === 'a' ? (d ? d.qtyB : 0) : (d ? d.qtyA : 0));
    const hasK = node.children.length > 0;
    const cerrado = collapsed.has(node.id);
    return (
        <div className={`ep-tree-item ep-diff-${estado}`} data-level={Math.min(node.nivel, 5)}>
            <div className="ep-tree-row ep-tree-row-cmp" style={{ paddingLeft: 8 + (node.nivel - 1) * 20 }}>
                {hasK
                    ? <button className={`ep-toggle-btn ${cerrado ? '' : 'open'}`} onClick={() => toggle(node.id)}>{cerrado ? '+' : '−'}</button>
                    : <span className="ep-leaf-dot"></span>}
                <PuntoDiferencia estado={estado} otraCantidad={otraCantidad} um={node.um} />
                <span className="ep-node-code">{node.code}</span>
                <span className="ep-node-desc" title={node.desc}>{node.desc}</span>
                <div className="ep-tree-right">
                    <span className="ep-node-qty">{fmtCantidad(node.qty)}</span>
                    <span className="ep-node-um" title={node.um}>{abrevUm(node.um)}</span>
                </div>
            </div>
            {hasK && !cerrado && (
                <div className="ep-tree-children">
                    {node.children.map(c => <NodoComparado key={c.id} node={c} ctx={ctx} />)}
                </div>
            )}
        </div>
    );
}

function ColumnaBom({ slot, datos, tree, diff, conDiferencias, soloDiferencias }) {
    const [collapsed, setCollapsed] = useState(new Set());
    const toggle = (id) => setCollapsed(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
    const letra = slot.toUpperCase();
    let cuerpo;
    if (datos.cargando) cuerpo = <div className="ep-loading"><div className="ep-spinner"></div>Cargando…</div>;
    else if (datos.error) cuerpo = <div className="ep-error-msg ep-cmp-msg">⚠ {datos.error}</div>;
    else if (!datos.rows.length) cuerpo = <div className="ep-placeholder"><div>Seleccioná un producto para BOM {letra}</div></div>;
    else if (!diff) cuerpo = <div className="ep-placeholder"><div>BOM {letra} cargado. Cargá el otro para comparar.</div></div>;
    else {
        const ctx = { slot, diff, conDiferencias, soloDiferencias, collapsed, toggle };
        cuerpo = tree.map(n => <NodoComparado key={n.id} node={n} ctx={ctx} />);
    }
    return (
        <div className="ep-cmp-col">
            <div className={`ep-cmp-col-hdr ep-hdr-${slot}`}>
                {datos.rows.length ? `${letra}: ${datos.codigo}${datos.descripcion ? ' — ' + datos.descripcion : ''}` : `BOM ${letra}`}
            </div>
            <div className="ep-cmp-col-body">{cuerpo}</div>
        </div>
    );
}

// Pestaña Comparar: carga dos BOM y los muestra lado a lado con las diferencias semaforizadas
function CompararBom({ baseURL, axiosConfig }) {
    const [a, setA] = useState(SLOT_VACIO);
    const [b, setB] = useState(SLOT_VACIO);
    const [busquedaA, setBusquedaA] = useState('');
    const [busquedaB, setBusquedaB] = useState('');
    const [soloDiferencias, setSoloDiferencias] = useState(false);
    const [exportando, setExportando] = useState(false);
    const ultimaCarga = useRef({ a: 0, b: 0 });

    const cargar = async (slot, codigo, descripcion = '', tipo, hoja) => {
        codigo = (codigo || '').trim();
        if (!codigo) return;
        const set = slot === 'a' ? setA : setB;
        (slot === 'a' ? setBusquedaA : setBusquedaB)(codigo);
        if (hoja) {
            set({ ...SLOT_VACIO, codigo, error: 'Es un componente hoja: no tiene estructura para comparar.' });
            return;
        }
        const n = ++ultimaCarga.current[slot];
        set({ ...SLOT_VACIO, codigo, cargando: true });
        try {
            const response = await axios.get(`${baseURL}/estructura-productos/estructura`, { ...axiosConfig, params: { codigo } });
            if (n !== ultimaCarga.current[slot]) return;
            set({ ...SLOT_VACIO, codigo, descripcion, rows: response.data });
        } catch (err) {
            if (n !== ultimaCarga.current[slot]) return;
            console.log(err);
            set({ ...SLOT_VACIO, codigo, error: err.response?.data?.error || 'Error obteniendo la estructura del producto' });
        }
    };

    const limpiar = (slot) => {
        ultimaCarga.current[slot]++;
        (slot === 'a' ? setA : setB)(SLOT_VACIO);
        (slot === 'a' ? setBusquedaA : setBusquedaB)('');
    };

    const treeA = useMemo(() => buildTree(a.rows).tree, [a.rows]);
    const treeB = useMemo(() => buildTree(b.rows).tree, [b.rows]);
    const diff = useMemo(() => a.rows.length && b.rows.length ? calcularDiferencias(a.rows, b.rows) : null, [a.rows, b.rows]);
    const resumen = useMemo(() => diff ? resumenDiferencias(diff) : null, [diff]);
    const conDifA = useMemo(() => diff ? nodosConDiferencias(treeA, diff, 'a') : new Set(), [treeA, diff]);
    const conDifB = useMemo(() => diff ? nodosConDiferencias(treeB, diff, 'b') : new Set(), [treeB, diff]);

    const exportar = async () => {
        if (!diff) return;
        setExportando(true);
        try {
            await exportarComparacionExcel({ codigoA: a.codigo, codigoB: b.codigo, diff });
        } catch (err) {
            console.log(err);
        } finally {
            setExportando(false);
        }
    };

    const slotBuscador = (slot, busqueda, setBusqueda, claseBtn) => (
        <div className={`ep-cmp-slot ep-cmp-slot-${slot}`}>
            <div className="ep-cmp-slot-label">BOM {slot.toUpperCase()}</div>
            <div className="ep-cmp-slot-row">
                <BuscadorProductos
                    baseURL={baseURL}
                    axiosConfig={axiosConfig}
                    valor={busqueda}
                    setValor={setBusqueda}
                    onSeleccionar={(codigo, descripcion, tipo, hoja) => cargar(slot, codigo, descripcion, tipo, hoja)}
                    onLimpiar={() => limpiar(slot)}
                    placeholder={`Buscar producto ${slot.toUpperCase()}…`}
                />
                <button className={`ep-btn ep-btn-sm ${claseBtn}`} onClick={() => cargar(slot, busqueda)}>Cargar</button>
            </div>
        </div>
    );

    return (
        <div className="ep-cmp">
            <div className="ep-cmp-bar">
                {slotBuscador('a', busquedaA, setBusquedaA, 'ep-btn-green')}
                <div className="ep-cmp-div">⇌</div>
                {slotBuscador('b', busquedaB, setBusquedaB, 'ep-btn-primary')}
                <div className="ep-cmp-controls">
                    <div className="ep-cmp-botones">
                        <button className={`ep-btn ep-btn-ghost ep-btn-sm ${soloDiferencias ? 'ep-btn-active' : ''}`}
                                onClick={() => setSoloDiferencias(!soloDiferencias)} disabled={!diff}>
                            Solo diferencias{resumen ? ` (${resumen.distintos})` : ''}
                        </button>
                        <button className="ep-btn ep-btn-green ep-btn-sm" onClick={exportar} disabled={!diff || exportando}>
                            {exportando ? '⏳ Generando…' : '↓ Excel'}
                        </button>
                    </div>
                    {resumen && (
                        <div className="ep-cmp-summary">
                            <span><span className="ep-diff-dot ep-dot-a">●</span>Solo A: <strong>{resumen.soloA}</strong></span>
                            <span><span className="ep-diff-dot ep-dot-b">●</span>Solo B: <strong>{resumen.soloB}</strong></span>
                            <span><span className="ep-diff-dot ep-dot-qty">▲</span>Cant. distinta: <strong>{resumen.qty}</strong></span>
                            <span className="ep-cmp-iguales">Iguales: {resumen.igual}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="ep-cmp-legend">
                <strong className="ep-cmp-legend-title">Semaforización:</strong>
                <span className="ep-cmp-leg-item"><span className="ep-diff-dot ep-dot-a">●</span>Solo en <strong>A</strong> — componente que no está en B</span>
                <span className="ep-cmp-leg-item"><span className="ep-diff-dot ep-dot-b">●</span>Solo en <strong>B</strong> — componente que no está en A</span>
                <span className="ep-cmp-leg-item"><span className="ep-diff-dot ep-dot-qty">▲</span>Mismo código, <strong>cantidad distinta</strong> entre A y B</span>
                <span className="ep-cmp-leg-item"><span className="ep-diff-dot ep-dot-eq">·</span>Código y cantidad <strong>iguales</strong> en ambos BOMs</span>
            </div>

            <div className="ep-cmp-split">
                <ColumnaBom slot="a" datos={a} tree={treeA} diff={diff} conDiferencias={conDifA} soloDiferencias={soloDiferencias} />
                <ColumnaBom slot="b" datos={b} tree={treeB} diff={diff} conDiferencias={conDifB} soloDiferencias={soloDiferencias} />
            </div>
        </div>
    );
}

export default CompararBom;
