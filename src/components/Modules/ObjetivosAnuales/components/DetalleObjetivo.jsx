import { useState, Fragment } from 'react';
import PilaresForm from './PilaresForm';
import ResultadoInput from './ResultadoInput';
import EstadoBadge from './EstadoBadge';
import { ESCALA, scoreClass } from '../constants';
import { fmt, pilaresListosParaGuardar } from '../utils';

function formatUmbral(pilar) {
    const u = pilar.unidad ? ` ${pilar.unidad}` : '';
    return [
        `${pilar.umbral_score1}${u}`,
        `${pilar.umbral_score2}${u}`,
        `${pilar.umbral_score3}${u}`,
        `${pilar.umbral_score4}${u}`,
        `${pilar.umbral_score5}${u}`,
    ];
}

// Vista de detalle de un registro de Objetivos Anuales — layout basado en el maquetado de referencia
// (info-prompts/ObjetivosAnuales/objetivos-anuales-escorial.html), pero data-driven a partir de
// {registro, pilares} en vez de un array de pilares fijo hardcodeado.
function DetalleObjetivo({ registro, pilares, soloLectura, puedeEditarPilares, onGuardarPilares, onGuardarResultado, onPublicar, guardando, mensaje }) {
    const [editandoPilares, setEditandoPilares] = useState(false);
    const [pilaresForm, setPilaresForm] = useState([]);

    const iniciarEdicion = () => {
        setPilaresForm(pilares.map(p => ({ ...p })));
        setEditandoPilares(true);
    };

    const guardarEdicion = async () => {
        const ok = await onGuardarPilares(pilaresForm);
        if (ok) setEditandoPilares(false);
    };

    const completo = pilares.length > 0 && pilares.every(p => p.puntaje !== null && p.puntaje !== undefined);

    return (
        <div className="oa-detalle">
            <div className="oa-doc-header">
                <div>
                    <div className="oa-doc-eyebrow">Escorial · Objetivos Anuales</div>
                    <div className="oa-doc-title">{fmt(registro.puesto_snapshot, 'Objetivos Anuales')}</div>
                    <div className="oa-doc-subtitle">Objetivos por pilar con criterio de evaluación 1–5. El resultado real de cada pilar se compara contra los umbrales definidos para asignar el puntaje automáticamente.</div>
                </div>
                <div className="oa-doc-badge">
                    <div className="oa-doc-badge-label">Ciclo</div>
                    <div className="oa-doc-badge-val">{registro.anio}</div>
                    <EstadoBadge estado={registro.estado} />
                </div>
            </div>

            <div className="oa-s-title">Datos generales</div>
            <div className="oa-person-card">
                <div className="oa-person-grid">
                    <div className="oa-field"><span className="oa-field-label">Nombre completo</span><span className="oa-field-valor">{fmt(registro.empleado_nombre)}</span></div>
                    <div className="oa-field"><span className="oa-field-label">Puesto</span><span className="oa-field-valor">{fmt(registro.puesto_snapshot)}</span></div>
                    <div className="oa-field"><span className="oa-field-label">Área</span><span className="oa-field-valor">{fmt(registro.area || registro.gerencia)}</span></div>
                    <div className="oa-field"><span className="oa-field-label">Evaluador</span><span className="oa-field-valor">{fmt(registro.evaluador)}</span></div>
                </div>
            </div>

            <div className="oa-s-title">Escala de puntaje</div>
            <div className="oa-scale-ref">
                {ESCALA.map(e => (
                    <div key={e.score} className={`oa-scale-card oa-sc-${e.score}`}>
                        <div className="oa-scale-num">{e.score}</div>
                        <div className="oa-scale-label">{e.label}</div>
                    </div>
                ))}
            </div>

            <div className="oa-s-title-row">
                <div className="oa-s-title">Objetivos por pilar</div>
                {puedeEditarPilares && !editandoPilares && (
                    <button type="button" className="oa-boton-secundario" onClick={iniciarEdicion}>
                        <i className="material-symbols-outlined">edit</i> Editar pilares
                    </button>
                )}
            </div>

            {editandoPilares ? (
                <>
                    <PilaresForm pilares={pilaresForm} onChange={setPilaresForm} />
                    <div className="oa-form-botones">
                        <button type="button" className="oa-boton-guardar" disabled={guardando || !pilaresListosParaGuardar(pilaresForm)} onClick={guardarEdicion}>
                            {guardando ? 'Guardando...' : 'Guardar pilares'}
                        </button>
                        <button type="button" className="oa-boton-limpiar" onClick={() => setEditandoPilares(false)} disabled={guardando}>
                            Cancelar
                        </button>
                    </div>
                </>
            ) : (
                <div className="oa-pillar-table-wrap">
                    <table className="oa-pillar-table">
                        <thead>
                            <tr>
                                <th className="oa-th-pilar">Pilar</th>
                                <th className="oa-th-desc">Descripción</th>
                                <th className="oa-th-peso">Peso</th>
                                <th colSpan="5">Criterio de evaluación</th>
                            </tr>
                            <tr className="oa-crit-subhead">
                                <td></td><td></td><td></td>
                                <td>1<br />No alcanza</td>
                                <td>2<br />Casi alcanza</td>
                                <td>3<br />Alcanza</td>
                                <td>4<br />Supera</td>
                                <td>5<br />Excede</td>
                            </tr>
                        </thead>
                        <tbody>
                            {pilares.map(pilar => (
                                <Fragment key={pilar.id}>
                                    <tr>
                                        <td className="oa-pillar-name-cell">{pilar.nombre}</td>
                                        <td className="oa-pillar-desc-cell">{pilar.descripcion}</td>
                                        <td className="oa-pillar-peso-cell">{pilar.peso}%</td>
                                        {formatUmbral(pilar).map((t, i) => <td key={i} className="oa-threshold-cell">{t}</td>)}
                                    </tr>
                                    <tr className="oa-pillar-result-row">
                                        <td colSpan="3">
                                            <span className="oa-result-label-mini">Resultado real {pilar.unidad ? `(${pilar.unidad})` : ''}</span>
                                            <ResultadoInput
                                                pilar={pilar}
                                                soloLectura={soloLectura || registro.estado === 'publicado'}
                                                guardando={guardando}
                                                onGuardar={(valor) => onGuardarResultado(pilar.id, valor)}
                                            />
                                        </td>
                                        <td colSpan="5"></td>
                                    </tr>
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="oa-final-card">
                <div className="oa-final-top">
                    <div>
                        <div className="oa-final-label">Puntaje final ponderado</div>
                        <div className="oa-final-desc">Suma de (puntaje del pilar × peso) de todos los pilares. Alimenta el eje de desempeño del 9-box junto con el promedio de competencias.</div>
                    </div>
                    <div className="oa-final-score-box">
                        <div className="oa-final-score-val">{fmt(registro.puntaje_final)}</div>
                        <div className="oa-final-score-sub">sobre 5.0</div>
                    </div>
                </div>
                <div className="oa-breakdown-grid">
                    {pilares.map(p => (
                        <div key={p.id} className="oa-breakdown-item">
                            <div className="oa-breakdown-pilar">{p.nombre}</div>
                            <div className={`oa-breakdown-score ${scoreClass(p.puntaje)}`}>{fmt(p.puntaje)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {mensaje && <div className={`oa-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

            {!soloLectura && registro.estado === 'borrador' && (
                <div className="oa-alert-box">
                    <strong>Antes de publicar:</strong> cargá el resultado real de cada pilar. El sistema compara automáticamente contra los umbrales y asigna el puntaje 1–5.
                    {' '}
                    <button type="button" className="oa-boton-guardar" disabled={!completo || guardando} onClick={onPublicar}>
                        Publicar
                    </button>
                </div>
            )}
        </div>
    );
}

export default DetalleObjetivo;
