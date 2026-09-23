import { useState, useEffect } from 'react';
import PreguntaRiesgoImpacto from './PreguntaRiesgoImpacto';
import EstadoBadge from '../EstadoBadge';
import { RIESGO_PREGUNTAS, IMPACTO_PREGUNTAS } from '../../constants';
import { fmt, riesgoImpactoCompleto } from '../../utils';

// Vista de detalle — layout basado en el maquetado de referencia
// (info-prompts/RRHHFormularios/Formulario Riesgo-Impacto de Pérdida.html), sin la sección
// "Análisis de la IA": acá no hay diagnóstico automático, el registro sólo persiste las
// respuestas cargadas por el evaluador.
function DetalleRiesgoImpacto({ registro, onGuardar, onEliminar, guardando, mensaje }) {
    const soloLectura = !registro.puede_editar || registro.estado === 'finalizado';

    const [evaluador, setEvaluador] = useState(registro.evaluador || '');
    const [antiguedad, setAntiguedad] = useState(registro.antiguedad || '');
    const [fecha, setFecha] = useState(registro.fecha ? registro.fecha.substring(0, 10) : '');
    const [respuestasRiesgo, setRespuestasRiesgo] = useState(registro.respuestas_riesgo || {});
    const [contextoRiesgo, setContextoRiesgo] = useState(registro.contexto_riesgo || '');
    const [respuestasImpacto, setRespuestasImpacto] = useState(registro.respuestas_impacto || {});
    const [contextoImpacto, setContextoImpacto] = useState(registro.contexto_impacto || '');

    useEffect(() => {
        setEvaluador(registro.evaluador || '');
        setAntiguedad(registro.antiguedad || '');
        setFecha(registro.fecha ? registro.fecha.substring(0, 10) : '');
        setRespuestasRiesgo(registro.respuestas_riesgo || {});
        setContextoRiesgo(registro.contexto_riesgo || '');
        setRespuestasImpacto(registro.respuestas_impacto || {});
        setContextoImpacto(registro.contexto_impacto || '');
    }, [registro]);

    const completo = riesgoImpactoCompleto(respuestasRiesgo, respuestasImpacto);

    const armarPayload = (estado) => ({
        evaluador, antiguedad, fecha: fecha || null,
        respuestas_riesgo: respuestasRiesgo, contexto_riesgo: contextoRiesgo,
        respuestas_impacto: respuestasImpacto, contexto_impacto: contextoImpacto,
        estado,
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
                    <div className="rf-doc-title">Riesgo e Impacto de Pérdida</div>
                    <div className="rf-doc-subtitle">Guía de preguntas para el líder. El diagnóstico Alto/Medio/Bajo queda a criterio de RRHH a partir de las respuestas cargadas.</div>
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
                            <div className="rf-field"><span className="rf-field-label">Antigüedad</span><span className="rf-field-valor">{fmt(antiguedad)}</span></div>
                            <div className="rf-field"><span className="rf-field-label">Fecha</span><span className="rf-field-valor">{fmt(fecha)}</span></div>
                        </>
                    ) : (
                        <>
                            <div className="rf-field"><label className="rf-field-label">Evaluador</label><input className="rf-field-input" value={evaluador} onChange={(e) => setEvaluador(e.target.value)} /></div>
                            <div className="rf-field"><label className="rf-field-label">Antigüedad</label><input className="rf-field-input" value={antiguedad} onChange={(e) => setAntiguedad(e.target.value)} placeholder="Ej: 4 años" /></div>
                            <div className="rf-field"><label className="rf-field-label">Fecha</label><input className="rf-field-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
                        </>
                    )}
                </div>
            </div>

            <div className="rf-s-title">Sección 1 — Señales de riesgo de pérdida</div>
            <div className="rf-section-card">
                <div className="rf-section-head riesgo-head">
                    <div className="rf-section-icon">⚡</div>
                    <div>
                        <div className="rf-section-title-txt">Probabilidad de que la persona deje Escorial en los próximos 12 meses</div>
                        <div className="rf-section-desc">Respondé en base a lo que observaste — no lo que la persona te dijo explícitamente</div>
                    </div>
                </div>
                <div className="rf-section-body">
                    {RIESGO_PREGUNTAS.map((p, i) => (
                        <PreguntaRiesgoImpacto
                            key={p.codigo}
                            numero={`R${i + 1}`}
                            pregunta={p}
                            valor={respuestasRiesgo[p.codigo]}
                            soloLectura={soloLectura}
                            onChange={(codigo, valor) => setRespuestasRiesgo(prev => ({ ...prev, [codigo]: valor }))}
                        />
                    ))}
                </div>
                <div className="rf-context-wrap">
                    <div className="rf-context-label">Contexto adicional — Riesgo</div>
                    {soloLectura ? (
                        <div className="rf-field-valor">{fmt(contextoRiesgo)}</div>
                    ) : (
                        <textarea className="rf-context-input" value={contextoRiesgo} onChange={(e) => setContextoRiesgo(e.target.value)} placeholder="¿Hay algo relevante que las preguntas anteriores no capturen?" />
                    )}
                </div>
            </div>

            <div className="rf-s-title">Sección 2 — Dimensiones de impacto de pérdida</div>
            <div className="rf-section-card">
                <div className="rf-section-head impacto-head">
                    <div className="rf-section-icon">📊</div>
                    <div>
                        <div className="rf-section-title-txt">Consecuencias para Escorial si esta persona se fuera hoy</div>
                        <div className="rf-section-desc">Evaluar el impacto en procesos, conocimiento y personas, no en el vínculo personal</div>
                    </div>
                </div>
                <div className="rf-section-body">
                    {IMPACTO_PREGUNTAS.map((p, i) => (
                        <PreguntaRiesgoImpacto
                            key={p.codigo}
                            numero={`I${i + 1}`}
                            pregunta={p}
                            valor={respuestasImpacto[p.codigo]}
                            soloLectura={soloLectura}
                            onChange={(codigo, valor) => setRespuestasImpacto(prev => ({ ...prev, [codigo]: valor }))}
                        />
                    ))}
                </div>
                <div className="rf-context-wrap">
                    <div className="rf-context-label">Contexto adicional — Impacto</div>
                    {soloLectura ? (
                        <div className="rf-field-valor">{fmt(contextoImpacto)}</div>
                    ) : (
                        <textarea className="rf-context-input" value={contextoImpacto} onChange={(e) => setContextoImpacto(e.target.value)} placeholder="¿Hay procesos específicos, conocimiento puntual o dependencias concretas relevantes?" />
                    )}
                </div>
            </div>

            <div className="rf-alert-box">
                <strong>Confidencialidad:</strong> este formulario es de uso exclusivo del evaluador y de RRHH. No se comparte con el colaborador evaluado.
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

export default DetalleRiesgoImpacto;
