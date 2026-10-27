import { fmtCosto, fmtCantidad, fmtFechaPrecio, fechaCotizacion, abrevUm, claseModularidad } from '../utils';

const SinPrecio = () => <span className="ep-no-price">—</span>;

function NodoArbol({ node, ctx }) {
    const { collapsed, toggle, selectedId, onSelect, filtro, paretoA, modCounts } = ctx;
    const hasK = node.children.length > 0;
    const cerrado = collapsed.has(node.id);

    const clases = ['ep-tree-row'];
    if (selectedId === node.id) clases.push('selected');
    if (filtro) {
        const match = node.code.toLowerCase().includes(filtro) || (node.desc || '').toLowerCase().includes(filtro);
        clases.push(match ? 'ep-search-match' : 'ep-search-dim');
    }
    if (modCounts) clases.push(claseModularidad(modCounts[(node.code || '').trim()] ?? 1));
    // ABC (Pareto 80/20): solo se clasifican las hojas de costo
    if (paretoA && node.isCostLeaf) clases.push(paretoA.has(node.id) ? 'ep-pareto-a' : 'ep-pareto-bc');
    const usdTitle = node.cotizacion != null
        ? `U$S × cant. (cotiz. $${fmtCosto(node.cotizacion)} al ${fmtFechaPrecio(fechaCotizacion(node))})`
        : 'Sin cotización disponible';

    // La sangría va en la propia fila (no en el contenedor de hijos) para que las columnas
    // de la derecha queden alineadas en todos los niveles
    return (
        <div className="ep-tree-item" data-level={Math.min(node.nivel, 5)}>
            <div className={clases.join(' ')} style={{ paddingLeft: 8 + (node.nivel - 1) * 20 }} onClick={() => onSelect(node.id)}>
                {hasK
                    ? <button className={`ep-toggle-btn ${cerrado ? '' : 'open'}`}
                              onClick={(e) => { e.stopPropagation(); toggle(node.id); }}>{cerrado ? '+' : '−'}</button>
                    : <span className="ep-leaf-dot"></span>}
                <span className="ep-node-code">{node.code}</span>
                <span className="ep-node-desc" title={node.desc}>{node.desc}</span>
                <div className="ep-tree-right">
                    <span className="ep-node-qty">{fmtCantidad(node.qty)}</span>
                    <span className="ep-node-um" title={node.um}>{abrevUm(node.um)}</span>
                    <span className="ep-cost-col ep-cost-unit" title="Precio unitario">{node.cuv != null ? fmtCosto(node.cuv) : <SinPrecio />}</span>
                    <span className="ep-cost-col ep-cost-ext" title="Precio × cantidad">{node.cniv != null ? fmtCosto(node.cniv) : <SinPrecio />}</span>
                    <span className="ep-cost-col ep-cost-mon">{node.mon || ''}</span>
                    <span className="ep-cost-col ep-cost-usd" title={usdTitle}>U$S {node.cniv_usd != null ? fmtCosto(node.cniv_usd) : <SinPrecio />}</span>
                    <span className="ep-node-kids-col">{hasK && <span className="ep-node-kids">{node.children.length}</span>}</span>
                </div>
            </div>
            {hasK && !cerrado && (
                <div className="ep-tree-children">
                    {node.children.map(c => <NodoArbol key={c.id} node={c} ctx={ctx} />)}
                </div>
            )}
        </div>
    );
}

function ArbolBom({ rootCode, rootTipo, tree, ...ctx }) {
    return (
        <>
            <div className="ep-root-header">
                <span className={`ep-root-badge ${rootTipo === 'COMP' ? 'ep-comp-badge' : ''}`}>{rootTipo}</span>
                <div>
                    <div className="ep-root-code">{rootCode}</div>
                    <div className="ep-root-hint">Clic en un nodo para seleccionarlo como bloque de exportación</div>
                </div>
            </div>
            <div>
                {tree.map(n => <NodoArbol key={n.id} node={n} ctx={ctx} />)}
            </div>
        </>
    );
}

export default ArbolBom;
