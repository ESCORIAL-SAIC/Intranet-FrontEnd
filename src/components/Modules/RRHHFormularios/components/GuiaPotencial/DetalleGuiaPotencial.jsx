import { useState, useEffect } from 'react';
import DimensionPotencial from './DimensionPotencial';
import EstadoBadge from '../EstadoBadge';
import { DIMENSIONES_POTENCIAL, POTENCIAL_GLOBAL_OPCIONES, PROYECCION_OPCIONES } from '../../constants';
import { fmt, guiaPotencialCompleta } from '../../utils';

// Vista de detalle — layout basado en el maquetado de referencia
// (info-prompts/RRHHFormularios/Guia de Potencial.html).
function DetalleGuiaPotencial({ registro, onGuardar, onEliminar, guardando, mensaje }) {
    const soloLectura = !registro.puede_editar || registro.estado === 'finalizado';

    const [evaluador, setEvaluador] = useState(registro.evaluador || '');
    const [antiguedadRol, setAntiguedadRol] = useState(registro.antiguedad_rol || '');
    const [fecha, setFecha] = useState(registro.fecha ? registro.fecha.substring(0, 10) : '');
    const [fitScore, setFitScore] = useState(registro.fit_score ?? '');
    const [perfilPredominante, setPerfilPredominante] = useState(registro.perfil_predominante || '');
    const [dimensiones, setDimensiones] = useState(registro.dimensiones || {});
    const [potencialGlobal, setPotencialGlobal] = useState(registro.potencial_global || '');
    const [proyeccionRol, setProyeccionRol] = useState(registro.proyeccion_rol || '');
    const [observaciones, setObservaciones] = useState(registro.observaciones || '');

    useEffect(() => {
        setEvaluador(registro.evaluador || '');
        setAntiguedadRol(registro.antiguedad_rol || '');
        setFecha(registro.fecha ? registro.fecha.substring(0, 10) : '');
        setFitScore(registro.fit_score ?? '');
        setPerfilPredominante(registro.perfil_predominante || '');
        setDimensiones(registro.dimensiones || {});
        setPotencialGlobal(registro.potencial_global || '');
        setProyeccionRol(registro.proyeccion_rol || '');
        setObservaciones(registro.observaciones || '');
    }, [registro]);

    const completo = guiaPotencialCompleta(dimensiones, potencialGlobal);

    const armarPayload = (estado) => ({
        evaluador, antiguedad_rol: antiguedadRol, fecha: fecha || null,
        fit_score: fitScore === '' ? null : Number(fitScore), perfil_predominante: perfilPredominante,
        dimensiones, potencial_global: potencialGlobal || null, proyeccion_rol: proyeccionRol || null,
        observaciones, estado,
    });

    const guardarBorrador = () => onGuardar(armarPayload('borrador'));
    const finalizar = () => {
        if (!completo) return;
        onGuardar(armarPayload('finalizado'));
    };

    return (
        <div className="rf-detalle">
            <div className="rf-doc-header">
                <div>
                    <div className="rf-doc-eyebrow">Escorial · Sistema de Talento</div>
                    <div className="rf-doc-title">Guía de evaluación de potencial</div>
                    <div className="rf-doc-subtitle">Potencial de crecimiento en los próximos 18–24 meses. La caja final del 9-box combina esta evaluación con el puntaje de desempeño del sistema.</div>
                </div>
                <div className="rf-doc-badge">
                    <div className="rf-doc-badge-label">Ciclo</div>
                    <div className="rf-doc-badge-val">{registro.ciclo_nombre || registro.anio}</div>
                    <EstadoBadge estado={registro.estado} />
                </div>
            </div>

            <div className="rf-s-title">Datos del colaborador</div>
            <div className="rf-person-card">
                <div className="rf-person-grid">
                    <div className="rf-field"><span className="rf-field-label">Nombre completo</span><span className="rf-field-valor">{fmt(registro.empleado_nombre)}</span></div>
                    <div className="rf-field"><span className="rf-field-label">Puesto</span><span className="rf-field-valor">{fmt(registro.puesto_snapshot)}</span></div>
                    <div className="rf-field"><span className="rf-field-label">Área</span><span className="rf-field-valor">{fmt(registro.area || registro.gerencia)}</span></div>
                    {soloLectura ? (
                        <>
                            <div className="rf-field"><span className="rf-field-label">Evaluador</span><span className="rf-field-valor">{fmt(evaluador)}</span></div>
                            <div className="rf-field"><span className="rf-field-label">Antigüedad en el rol</span><span className="rf-field-valor">{fmt(antiguedadRol)}</span></div>
                            <div className="rf-field"><span className="rf-field-label">Fecha</span><span className="rf-field-valor">{fmt(fecha)}</span></div>
                        </>
                    ) : (
                        <>
                            <div className="rf-field"><label className="rf-field-label">Evaluador</label><input className="rf-field-input" value={evaluador} onChange={(e) => setEvaluador(e.target.value)} /></div>
                            <div className="rf-field"><label className="rf-field-label">Antigüedad en el rol</label><input className="rf-field-input" value={antiguedadRol} onChange={(e) => setAntiguedadRol(e.target.value)} placeholder="Ej: 2 años" /></div>
                            <div className="rf-field"><label className="rf-field-label">Fecha</label><input className="rf-field-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
                        </>
                    )}
                </div>
            </div>

            <div className="rf-genoma-card">
                <div className="rf-genoma-body">
                    <div className="rf-genoma-label">Ancla objetiva — Genomawork</div>
                    <div className="rf-genoma-desc">El FIT score refleja la adecuación conductual y cognitiva al rol. Usarlo como dato objetivo que acompañe la evaluación del líder — no que la reemplace.</div>
                </div>
                <div className="rf-genoma-fit">
                    <div className="rf-fit-field">
                        <div className="rf-fit-label">FIT score</div>
                        {soloLectura ? (
                            <div className="rf-field-valor">{fmt(fitScore)}</div>
                        ) : (
                            <input className="rf-fit-input" type="number" min="0" max="100" value={fitScore} onChange={(e) => setFitScore(e.target.value)} placeholder="—" />
                        )}
                        <div className="rf-fit-note">Escala 0–100</div>
                    </div>
                    <div className="rf-fit-field">
                        <div className="rf-fit-label">Perfil predominante</div>
                        {soloLectura ? (
                            <div className="rf-field-valor">{fmt(perfilPredominante)}</div>
                        ) : (
                            <input className="rf-field-input" value={perfilPredominante} onChange={(e) => setPerfilPredominante(e.target.value)} placeholder="Ej: Analítico · Ejecutor" />
                        )}
                    </div>
                </div>
            </div>

            <div className="rf-s-title">Dimensiones de potencial</div>
            {DIMENSIONES_POTENCIAL.map((d, i) => (
                <DimensionPotencial
                    key={d.codigo}
                    numero={i + 1}
                    dimension={d}
                    valor={dimensiones[d.codigo]}
                    soloLectura={soloLectura}
                    onChange={(codigo, val) => setDimensiones(prev => ({ ...prev, [codigo]: val }))}
                />
            ))}

            <div className="rf-s-title">Síntesis y rating global</div>
            <div className="rf-synthesis-card">
                <div className="rf-synthesis-grid">
                    <div>
                        <span className="rf-synthesis-label">Potencial global</span>
                        {soloLectura ? (
                            <div className="rf-field-valor">{POTENCIAL_GLOBAL_OPCIONES.find(o => o.value === potencialGlobal)?.label || '—'}</div>
                        ) : (
                            <div className="rf-global-rating">
                                {POTENCIAL_GLOBAL_OPCIONES.map(o => (
                                    <label key={o.value} className={`rf-gr-label gr-${o.value} ${potencialGlobal === o.value ? 'checked' : ''}`}>
                                        <input type="radio" name="potencial-global" checked={potencialGlobal === o.value} onChange={() => setPotencialGlobal(o.value)} />
                                        <div className="rf-gr-num">{o.letra}</div>
                                        <div><div className="rf-gr-text">{o.label}</div><div className="rf-gr-desc">{o.desc}</div></div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <span className="rf-synthesis-label">Proyección de rol (18–24 meses)</span>
                        {soloLectura ? (
                            <div className="rf-field-valor">{PROYECCION_OPCIONES.find(o => o.value === proyeccionRol)?.label || '—'}</div>
                        ) : (
                            <div className="rf-proy-options">
                                {PROYECCION_OPCIONES.map(o => (
                                    <label key={o.value} className={`rf-proy-label ${proyeccionRol === o.value ? 'checked' : ''}`}>
                                        <input type="radio" name="proyeccion-rol" checked={proyeccionRol === o.value} onChange={() => setProyeccionRol(o.value)} />
                                        <span className="proy-dot"></span>{o.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rf-observaciones-wrap">
                    <span className="rf-synthesis-label">Observaciones del evaluador</span>
                    {soloLectura ? (
                        <div className="rf-field-valor">{fmt(observaciones)}</div>
                    ) : (
                        <textarea className="rf-obs-textarea" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Contexto adicional, condicionantes de la evaluación, factores externos relevantes..." />
                    )}
                </div>
            </div>

            <div className="rf-alert-box">
                <strong>Recordatorio:</strong> esta evaluación es un insumo, no una decisión final. El rating de potencial se valida y puede ajustarse en la Mesa de Talento. Uso exclusivo del evaluador y RRHH — no compartir con el colaborador.
            </div>

            {mensaje && <div className={`rf-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

            {!soloLectura && (
                <div className="rf-form-botones">
                    <button type="button" className="rf-boton-limpiar" disabled={guardando} onClick={guardarBorrador}>
                        {guardando ? 'Guardando...' : 'Guardar borrador'}
                    </button>
                    <button type="button" className="rf-boton-guardar" disabled={guardando || !completo} onClick={finalizar}>
                        Finalizar
                    </button>
                    <button type="button" className="rf-boton-icono" disabled={guardando} onClick={onEliminar}>
                        <i className="material-symbols-outlined">delete</i> Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

export default DetalleGuiaPotencial;
