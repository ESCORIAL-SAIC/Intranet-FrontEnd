import { useEffect, useRef, useState } from 'react';

const LEVEL_BG  = { 0: '#3b82f6', 1: '#1e3a5f', 2: '#14532d', 3: '#713f12', 4: '#581c87', 5: '#134e4a' };
const LEVEL_FNT = { 0: '#ffffff', 1: '#93c5fd', 2: '#86efac', 3: '#fcd34d', 4: '#d8b4fe', 5: '#5eead4' };

// Vista jerárquica del BOM con vis-network: un nodo por código (en su nivel mínimo), aristas padre → hijo.
// vis-network se carga bajo demanda para no sumarlo al bundle inicial de la intranet.
function GrafoBom({ rows, rootCode, onSelectCode }) {
    const containerRef = useRef(null);
    const onSelectRef = useRef(onSelectCode);
    const [estado, setEstado] = useState('cargando');
    onSelectRef.current = onSelectCode;

    useEffect(() => {
        let network = null;
        let cancelado = false;

        (async () => {
            const { Network, DataSet } = await import('vis-network/standalone');
            if (cancelado) return;

            const codeInfo = new Map();
            const parentSet = new Set();
            for (const row of rows) {
                const ex = codeInfo.get(row.hijo);
                if (!ex || row.nivel < ex.nivel) codeInfo.set(row.hijo, { nivel: row.nivel, desc: row.descripcion });
                parentSet.add(row.padre);
            }
            if (!codeInfo.has(rootCode)) codeInfo.set(rootCode, { nivel: 0, desc: rootCode });

            const visNodes = [];
            for (const [code, info] of codeInfo) {
                const lvl = Math.min(info.nivel, 5);
                const esRaiz = code === rootCode;
                const bg = esRaiz ? LEVEL_BG[0] : LEVEL_BG[lvl];
                const fg = esRaiz ? LEVEL_FNT[0] : LEVEL_FNT[lvl];
                visNodes.push({
                    id: code, label: code, title: info.desc || code,
                    color: { background: bg, border: bg, highlight: { background: bg, border: '#fff' } },
                    font: { color: fg, size: 13, face: 'Inter,system-ui,sans-serif' },
                    shape: esRaiz ? 'box' : (parentSet.has(code) ? 'ellipse' : 'dot'),
                });
            }

            const edgeSet = new Set();
            const visEdges = [];
            for (const row of rows) {
                const key = `${row.padre}→${row.hijo}`;
                if (edgeSet.has(key)) continue;
                edgeSet.add(key);
                visEdges.push({
                    from: row.padre, to: row.hijo, arrows: 'to',
                    color: { color: '#555', highlight: '#aaa', hover: '#aaa' },
                });
            }

            network = new Network(
                containerRef.current,
                { nodes: new DataSet(visNodes), edges: new DataSet(visEdges) },
                {
                    layout: {
                        hierarchical: {
                            enabled: true, direction: 'UD', sortMethod: 'directed',
                            levelSeparation: 110, nodeSpacing: 160, treeSpacing: 220,
                            blockShifting: true, edgeMinimization: true, parentCentralization: true,
                        },
                    },
                    physics: { enabled: false },
                    edges: { smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 } },
                    nodes: { borderWidth: 0, margin: 8 },
                    interaction: { hover: true, tooltipDelay: 150, zoomView: true, dragView: true },
                }
            );
            network.on('click', params => {
                if (params.nodes.length) onSelectRef.current(params.nodes[0]);
            });
            setTimeout(() => network?.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } }), 100);
            setEstado('listo');
        })().catch(err => {
            console.log(err);
            if (!cancelado) setEstado('error');
        });

        return () => {
            cancelado = true;
            if (network) network.destroy();
            network = null;
        };
    }, [rows, rootCode]);

    return (
        <div className="ep-graph-container">
            {estado === 'cargando' && <div className="ep-graph-msg">⚙ Calculando posiciones…</div>}
            {estado === 'error' && <div className="ep-graph-msg ep-text-error">No se pudo dibujar el grafo.</div>}
            <div ref={containerRef} className="ep-graph-canvas"></div>
        </div>
    );
}

export default GrafoBom;
