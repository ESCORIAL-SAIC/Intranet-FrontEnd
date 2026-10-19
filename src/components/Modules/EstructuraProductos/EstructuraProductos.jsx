import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EstructuraProductos.css';

import BuscadorProductos from './components/BuscadorProductos';
import ArbolBom from './components/ArbolBom';
import GrafoBom from './components/GrafoBom';
import { buildTree, costoHojas, flattenNode, idsConHijos, fmtCosto } from './utils';
import { exportarExcel } from './exportarExcel';

/* ESTRUCTURA DE PRODUCTOS (BOM) — migrado del BOM Viewer de AndonLineasProduccion (files/bom_viewer.html) */

function EstructuraProductos() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [busqueda, setBusqueda] = useState('');
    const [producto, setProducto] = useState(null);       // { codigo, descripcion } del PT cargado
    const [rows, setRows] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const [collapsed, setCollapsed] = useState(new Set());
    const [selectedId, setSelectedId] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [puedeVerCostos, setPuedeVerCostos] = useState(false);
    const [costosVis, setCostosVis] = useState(false);
    const [heatmap, setHeatmap] = useState(false);
    const [modCounts, setModCounts] = useState(null);     // { codigo: cantidad de PT } con Modularidad activa
    const [modCargando, setModCargando] = useState(false);
    const [modError, setModError] = useState(false);
    const [grafo, setGrafo] = useState(false);
    const [dondeSeUsa, setDondeSeUsa] = useState(null);   // { cargando, error, items }
    const [exportando, setExportando] = useState(false);

    const treeOuterRef = useRef(null);
    const ultimaCarga = useRef(0);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get(`${baseURL}/main`, axiosConfig).catch(() => navigate('/login'));
        // Los costos solo se muestran a rol_estructura_producto_costo / administradores
        // (la API además no devuelve precios al resto)
        axios.get(`${baseURL}/estructura-productos/permisos`, axiosConfig)
            .then(response => setPuedeVerCostos(response.data.ver_costos === true))
            .catch(err => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { tree, nodeMap } = useMemo(() => buildTree(rows), [rows]);
    const selectedNode = selectedId != null ? nodeMap.get(selectedId) : null;

    const resumen = useMemo(() => {
        const monedas = [...new Set(rows.filter(r => r.moneda).map(r => r.moneda))];
        return {
            componentes: rows.length,
            niveles: rows.reduce((m, r) => Math.max(m, r.nivel), 0),
            n1: rows.filter(r => r.nivel === 1).length,
            n2: rows.filter(r => r.nivel === 2).length,
            n3: rows.filter(r => r.nivel >= 3).length,
            costoTotal: costoHojas(tree),
            monedas: monedas.join(' / '),
            conCosto: rows.filter(r => r.costo_unitario != null).length,
            // Base del heatmap: costo total del PT (100% = costo del producto completo)
            rootCacum: tree.reduce((s, n) => s + (n.cacum || 0), 0),
        };
    }, [rows, tree]);

    const resetModos = () => {
        setHeatmap(false);
        setModCounts(null);
        setModError(false);
        setGrafo(false);
        setFiltro('');
        setSelectedId(null);
        setDondeSeUsa(null);
        setCollapsed(new Set());
    };

    const cargarEstructura = async (codigo, descripcion = '', tipo = 'PT') => {
        codigo = (codigo || '').trim();
        if (!codigo) return;
        const n = ++ultimaCarga.current;
        setBusqueda(codigo);
        resetModos();
        setRows([]);
        setError(null);
        setCargando(true);
        try {
            const response = await axios.get(`${baseURL}/estructura-productos/estructura`, { ...axiosConfig, params: { codigo } });
            if (n !== ultimaCarga.current) return;
            setRows(response.data);
            setProducto({ codigo, descripcion, tipo: tipo || 'PT' });
        } catch (err) {
            if (n !== ultimaCarga.current) return;
            console.log(err);
            setProducto(null);
            setError(err.response?.data?.error || 'Error obteniendo la estructura del producto');
        } finally {
            if (n === ultimaCarga.current) setCargando(false);
        }
    };

    const limpiar = () => {
        ultimaCarga.current++;
        setBusqueda('');
        setProducto(null);
        setRows([]);
        setError(null);
        setCargando(false);
        resetModos();
    };

    // ── Selección de nodo + "dónde se usa" ───────────────────────
    const seleccionarNodo = async (id) => {
        if (selectedId === id) {
            setSelectedId(null);
            setDondeSeUsa(null);
            return;
        }
        const node = nodeMap.get(id);
        if (!node) return;
        setSelectedId(id);
        setDondeSeUsa({ cargando: true, error: false, items: [], codigo: node.code });
        try {
            const response = await axios.get(`${baseURL}/estructura-productos/donde-se-usa`, { ...axiosConfig, params: { codigo: node.code } });
            setDondeSeUsa(prev => prev?.codigo !== node.code ? prev : {
                cargando: false, error: false, codigo: node.code,
                items: response.data.filter(item => item.codigo !== producto?.codigo),
            });
        } catch (err) {
            console.log(err);
            setDondeSeUsa(prev => prev?.codigo !== node.code ? prev : { cargando: false, error: true, items: [], codigo: node.code });
        }
    };

    const seleccionarPorCodigo = (code) => {
        for (const [id, node] of nodeMap) {
            if (node.code === code) { seleccionarNodo(id); break; }
        }
    };

    const deseleccionar = () => {
        setSelectedId(null);
        setDondeSeUsa(null);
    };

    // ── Controles ────────────────────────────────────────────────
    const toggleNodo = (id) => setCollapsed(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
    const expandirTodo = () => setCollapsed(new Set());
    const contraerTodo = () => setCollapsed(new Set(idsConHijos(tree)));

    const toggleCostos = () => {
        if (costosVis) setHeatmap(false); // el heatmap depende de los costos
        setCostosVis(!costosVis);
    };

    const toggleModularidad = async () => {
        if (modCounts || modCargando) {
            setModCounts(null);
            return;
        }
        const codigos = [...new Set(rows.map(r => (r.hijo || '').trim()))].filter(Boolean);
        if (!codigos.length) return;
        setModError(false);
        setModCargando(true);
        try {
            const response = await axios.post(`${baseURL}/estructura-productos/reuse-counts`, { codigos }, axiosConfig);
            setModCounts(response.data);
        } catch (err) {
            console.log(err);
            setModError(true);
        } finally {
            setModCargando(false);
        }
    };

    const onFiltro = (valor) => {
        setFiltro(valor);
        if (valor) setCollapsed(new Set()); // expandir para que los nodos ocultos sean alcanzables
    };

    useEffect(() => {
        if (!filtro) return;
        treeOuterRef.current?.querySelector('.ep-search-match')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [filtro]);

    const exportar = async () => {
        const nodes = selectedNode ? flattenNode(selectedNode) : tree.flatMap(n => flattenNode(n));
        if (!nodes.length) return;
        setExportando(true);
        try {
            await exportarExcel({ raiz: producto?.codigo || 'BOM', nodes, conCostos: costosVis });
        } catch (err) {
            console.log(err);
        } finally {
            setExportando(false);
        }
    };

    const hayBom = !!producto && rows.length > 0;
    const filtroNorm = filtro.trim().toLowerCase();

    return (
        <div className={`ep-estructura-productos ${costosVis ? 'ep-costos-visibles' : ''}`}>
            <div className="ep-hdr">
                <div className="ep-hdr-title">Estructura de Producto</div>
                <div className="ep-hdr-sub">BOM Viewer · Lista de materiales</div>
            </div>

            <div className="ep-search-bar">
                <BuscadorProductos
                    baseURL={baseURL}
                    axiosConfig={axiosConfig}
                    valor={busqueda}
                    setValor={setBusqueda}
                    onSeleccionar={cargarEstructura}
                    onLimpiar={limpiar}
                />
                <button className="ep-btn ep-btn-primary" onClick={() => cargarEstructura(busqueda)}>Buscar</button>

                {hayBom && (
                    <div className="ep-controls">
                        <button className="ep-btn ep-btn-ghost" onClick={expandirTodo} disabled={grafo}>Expandir todo</button>
                        <button className="ep-btn ep-btn-ghost" onClick={contraerTodo} disabled={grafo}>Contraer todo</button>
                        {puedeVerCostos && (
                            <button className={`ep-btn ep-btn-ghost ${costosVis ? 'ep-btn-active' : ''}`} onClick={toggleCostos}>
                                {costosVis ? 'Ocultar costos' : 'Mostrar costos'}
                            </button>
                        )}
                        {costosVis && (
                            <button className={`ep-btn ep-btn-ghost ${heatmap ? 'ep-btn-active' : ''}`} onClick={() => setHeatmap(!heatmap)}>
                                {heatmap ? 'Heatmap ✓' : 'Heatmap'}
                            </button>
                        )}
                        <button className={`ep-btn ep-btn-ghost ${modCounts || modCargando ? 'ep-btn-active' : ''}`} onClick={toggleModularidad}>
                            {modCargando ? 'Cargando…' : 'Modularidad'}
                        </button>
                        <button className="ep-btn ep-btn-ghost" onClick={() => setGrafo(!grafo)}>
                            {grafo ? '🌳 Ver árbol' : 'Ver grafo'}
                        </button>
                        <div className="ep-tree-search-wrap">
                            <input
                                type="text"
                                className="ep-tree-search-inp"
                                placeholder="Buscar en árbol…"
                                autoComplete="off"
                                spellCheck="false"
                                value={filtro}
                                onChange={(e) => onFiltro(e.target.value)}
                            />
                            {filtro && <button className="ep-tree-search-clear" onClick={() => setFiltro('')} title="Limpiar búsqueda en árbol">✕</button>}
                        </div>
                        <button className="ep-btn ep-btn-green" onClick={exportar} disabled={exportando}>
                            {exportando ? '⏳ Generando…' : '↓ Exportar Excel'}
                        </button>
                    </div>
                )}
            </div>

            {hayBom && (
                <div className="ep-stats">
                    <div className="ep-stat ep-c-blue"><div className="ep-stat-lbl">Componentes</div><div className="ep-stat-val">{resumen.componentes}</div></div>
                    <div className="ep-stat ep-c-blue"><div className="ep-stat-lbl">Niveles</div><div className="ep-stat-val">{resumen.niveles}</div></div>
                    <div className="ep-stat"><div className="ep-stat-lbl">Nivel 1</div><div className="ep-stat-val">{resumen.n1}</div></div>
                    <div className="ep-stat"><div className="ep-stat-lbl">Nivel 2</div><div className="ep-stat-val">{resumen.n2}</div></div>
                    <div className="ep-stat"><div className="ep-stat-lbl">Nivel 3+</div><div className="ep-stat-val">{resumen.n3}</div></div>
                    {costosVis && (
                        <div className="ep-stat ep-c-amber">
                            <div className="ep-stat-lbl">Costo total PT</div>
                            <div className="ep-stat-val">{fmtCosto(resumen.costoTotal)}</div>
                            <div className="ep-stat-sub">{resumen.monedas}</div>
                        </div>
                    )}
                </div>
            )}

            <div className="ep-main-split">
                {hayBom && (
                    <div className="ep-left-panel">
                        <div className="ep-lp-section">
                            <div className="ep-lp-pt-top">
                                <span className={`ep-root-badge ${producto.tipo === 'COMP' ? 'ep-comp-badge' : ''}`}>{producto.tipo}</span>
                                <div className="ep-lp-pt-info">
                                    <div className="ep-lp-pt-code">{producto.codigo}</div>
                                    <div className="ep-lp-pt-desc">{producto.descripcion}</div>
                                </div>
                            </div>
                            {costosVis && resumen.conCosto > 0 && (
                                <>
                                    <hr className="ep-lp-rule" />
                                    <div className="ep-lp-costo-lbl">Costo del producto</div>
                                    <div className="ep-lp-costo-val">{fmtCosto(resumen.costoTotal)}</div>
                                    <div className="ep-lp-costo-det">{resumen.monedas} · {resumen.conCosto}/{rows.length} insumos con precio</div>
                                </>
                            )}
                            {selectedNode && (
                                <div className="ep-export-hint">
                                    <span>Bloque seleccionado: <strong>{selectedNode.code} — {selectedNode.desc}</strong></span>
                                    <span className="ep-export-hint-sub">El Excel incluirá sólo ese bloque y sus sub-componentes.</span>
                                    <button className="ep-link-btn" onClick={deseleccionar}>Quitar selección</button>
                                </div>
                            )}
                        </div>

                        {(selectedNode || modError) && (
                            <div className="ep-lp-section">
                                <div className="ep-panel-header">
                                    <span>{selectedNode ? '🔗 Nodo seleccionado' : '⚠ Modularidad'}</span>
                                    <button className="ep-panel-close" onClick={() => { deseleccionar(); setModError(false); }}>✕</button>
                                </div>
                                {selectedNode ? (
                                    <>
                                        <div className="ep-panel-nodo-code">{selectedNode.code}</div>
                                        <div className="ep-panel-nodo-desc">{selectedNode.desc}</div>
                                        {dondeSeUsa?.cargando && (
                                            <div className="ep-panel-loading"><div className="ep-spinner"></div><span>Cargando…</span></div>
                                        )}
                                        {dondeSeUsa?.error && (
                                            <div className="ep-text-error ep-panel-msg">No se pudo cargar. Verificá la conexión con el servidor.</div>
                                        )}
                                        {dondeSeUsa && !dondeSeUsa.cargando && !dondeSeUsa.error && (
                                            dondeSeUsa.items.length === 0
                                                ? <div className="ep-panel-msg">Solo se usa en este producto.</div>
                                                : <>
                                                    <div className="ep-panel-nodo-usado-lbl">Usado en estos productos</div>
                                                    <div className="ep-use-chip-list">
                                                        {dondeSeUsa.items.map(item => (
                                                            <button key={item.codigo} className="ep-use-chip" title={item.descripcion}
                                                                    onClick={() => cargarEstructura(item.codigo, item.descripcion)}>
                                                                {item.codigo}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                        )}
                                    </>
                                ) : (
                                    <div className="ep-text-error ep-panel-msg">No se pudo cargar el conteo de reutilización. Verificá la conexión.</div>
                                )}
                            </div>
                        )}

                        {heatmap && (
                            <div className="ep-lp-section">
                                <div className="ep-lp-legend-title">Heatmap de costo</div>
                                <div className="ep-heatmap-gradient"></div>
                                <div className="ep-heatmap-scale">
                                    <span style={{ color: 'hsl(120deg,55%,38%)' }}>0%</span>
                                    <span style={{ color: 'hsl(90deg,50%,36%)' }}>25%</span>
                                    <span style={{ color: 'hsl(60deg,55%,34%)' }}>50%</span>
                                    <span style={{ color: 'hsl(30deg,55%,36%)' }}>75%</span>
                                    <span style={{ color: 'hsl(0deg,55%,38%)' }}>100%</span>
                                </div>
                                <div className="ep-lp-legend-item">Porcentaje del <strong>&nbsp;costo acumulado&nbsp;</strong> respecto al costo total del producto (100% = costo del PT).</div>
                            </div>
                        )}

                        {(modCounts || modCargando) && (
                            <div className="ep-lp-section">
                                <div className="ep-lp-legend-title">🧩 Modularidad</div>
                                <div className="ep-lp-legend-item"><span className="ep-leg-dot ep-leg-blue"></span> Plataforma (5+ productos)</div>
                                <div className="ep-lp-legend-item"><span className="ep-leg-dot ep-leg-amber"></span> Variante (2–4 productos)</div>
                                <div className="ep-lp-legend-item"><span className="ep-leg-dot ep-leg-grey"></span> Único (1 producto)</div>
                            </div>
                        )}
                    </div>
                )}

                <div className="ep-tree-area">
                    {hayBom && grafo ? (
                        <GrafoBom rows={rows} rootCode={producto.codigo} onSelectCode={seleccionarPorCodigo} />
                    ) : (
                        <div className="ep-tree-outer" ref={treeOuterRef}>
                            {cargando && <div className="ep-loading"><div className="ep-spinner"></div>Cargando estructura…</div>}
                            {!cargando && error && <div className="ep-error-msg">⚠ {error}</div>}
                            {!cargando && !error && !hayBom && (
                                <div className="ep-placeholder">
                                    <span className="material-symbols-outlined ep-placeholder-icon">account_tree</span>
                                    <div>Hacé clic en el buscador para ver el listado de productos</div>
                                    <div className="ep-placeholder-sub">O escribí para filtrar por código o descripción</div>
                                </div>
                            )}
                            {!cargando && hayBom && (
                                <ArbolBom
                                    rootCode={producto.codigo}
                                    rootTipo={producto.tipo}
                                    tree={tree}
                                    collapsed={collapsed}
                                    toggle={toggleNodo}
                                    selectedId={selectedId}
                                    onSelect={seleccionarNodo}
                                    filtro={filtroNorm}
                                    baseHeatmap={heatmap ? resumen.rootCacum : null}
                                    modCounts={modCounts}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EstructuraProductos;
