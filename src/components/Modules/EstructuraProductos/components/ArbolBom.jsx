import { fmtCosto, fmtCantidad, colorHeatmap, claseModularidad } from '../utils';

const SinPrecio = () => <span className="ep-no-price">—</span>;

function NodoArbol({ node, ctx }) {
    const { collapsed, toggle, selectedId, onSelect, filtro, baseHeatmap, modCounts } = ctx;
    const hasK = node.children.length > 0;
    const cerrado = collapsed.has(node.id);

    const clases = ['ep-tree-row'];
    if (selectedId === node.id) clases.push('selected');
    if (filtro) {
        const match = node.code.toLowerCase().includes(filtro) || (node.desc || '').toLowerCase().includes(filtro);
        clases.push(match ? 'ep-search-match' : 'ep-search-dim');
    }
    if (modCounts) clases.push(claseModularidad(modCounts[(node.code || '').trim()] ?? 1));
    const style = baseHeatmap != null ? { background: colorHeatmap(node.cacum, baseHeatmap) } : undefined;

    return (
        <div className="ep-tree-item" data-level={Math.min(node.nivel, 5)}>
            <div className={clases.join(' ')} style={style} onClick={() => onSelect(node.id)}>
                {hasK
                    ? <button className={`ep-toggle-btn ${cerrado ? '' : 'open'}`}
                              onClick={(e) => { e.stopPropagation(); toggle(node.id); }}>{cerrado ? '+' : '−'}</button>
                    : <span className="ep-leaf-dot"></span>}
                <span className="ep-node-code">{node.code}</span>
                <span className="ep-node-desc" title={node.desc}>{node.desc}</span>
                <span className="ep-node-qty">{fmtCantidad(node.qty)}<span className="ep-node-um"> {node.um}</span></span>
                <span className="ep-cost-col ep-cost-unit" title="Precio unitario">{node.cuv != null ? fmtCosto(node.cuv) : <SinPrecio />}</span>
                <span className="ep-cost-col ep-cost-ext" title="Precio × cantidad">{node.cniv != null ? fmtCosto(node.cniv) : <SinPrecio />}</span>
                <span className="ep-cost-col ep-cost-mon">{node.mon || ''}</span>
                {hasK && <span className="ep-node-kids">{node.children.length}</span>}
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
