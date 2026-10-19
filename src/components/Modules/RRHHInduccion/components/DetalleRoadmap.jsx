import { TIPOS_INDUCCION, ESTADOS_ENCUESTA_1MES } from '../constants';
import { fmt, fmtFecha } from '../utils';
import { EstadoRoadmap, ProximoPendiente } from './ListadoRoadmaps';
import ProgresoInduccion from './ProgresoInduccion';
import RoadmapTimeline from './RoadmapTimeline';

// Vista RRHH de un roadmap: seguimiento (inducciones, evaluaciones y encuestas) y resultado
// de la encuesta de satisfacción.
function DetalleRoadmap({ roadmap, guardando, onToggleItem, onToggleEvaluacion, onToggleEncuesta1Mes, onEditar, onEliminar }) {
    const tipo = (TIPOS_INDUCCION.find(t => t.value === roadmap.tipo) || {}).label || roadmap.tipo;
    const encuesta = roadmap.encuesta_respuestas;
    const borrador = roadmap.estado === 'borrador';
    const e1m = roadmap.encuesta_1mes;

    return (
        <div>
            <div className="ri-detalle-header">
                <div>
                    <div className="ri-detalle-eyebrow">Roadmap de inducción · {tipo}</div>
                    <div className="ri-detalle-titulo">{fmt(roadmap.nombre_snapshot)}</div>
                    <div className="ri-detalle-sub">
                        Legajo {fmt(roadmap.legajo_snapshot)} · {fmt(roadmap.puesto_snapshot)}
                    </div>
                </div>
                <div className="ri-detalle-acciones">
                    <EstadoRoadmap estado={roadmap.estado} />
                    <button type="button" className="ri-boton-secundario" disabled={guardando} onClick={onEditar}>
                        <i className="material-symbols-outlined">edit</i> Editar
                    </button>
                    <button type="button" className="ri-boton-icono peligro" disabled={guardando} onClick={onEliminar} title="Eliminar roadmap">
                        <i className="material-symbols-outlined">delete</i>
                    </button>
                </div>
            </div>

            <ProgresoInduccion progreso={roadmap.progreso} estado={roadmap.estado} />

            {!borrador && (
                <section className="ri-resumen">
                    <div className="ri-resumen-item">
                        <div className="ri-label">Próximo pendiente</div>
                        <ProximoPendiente pendiente={roadmap.proximo_pendiente} />
                    </div>
                    <div className={`ri-resumen-item ${roadmap.actividades_atrasadas > 0 ? 'alerta' : ''}`}>
                        <div className="ri-label">Inducciones atrasadas</div>
                        <div className="ri-resumen-numero">{roadmap.actividades_atrasadas}</div>
                    </div>
                    <div className={`ri-resumen-item ${roadmap.evaluaciones_pendientes > 0 ? 'alerta' : ''}`}>
                        <div className="ri-label">Evaluaciones pendientes</div>
                        <div className="ri-resumen-numero">{roadmap.evaluaciones_pendientes}</div>
                    </div>
                    <div className="ri-resumen-item">
                        <div className="ri-label">Encuesta de 1.er mes</div>
                        <span className={`ri-chip ${ESTADOS_ENCUESTA_1MES[e1m.estado].className}`}>{ESTADOS_ENCUESTA_1MES[e1m.estado].label}</span>
                        {e1m.estado !== 'completada' && e1m.disponible_desde && (
                            <div className="ri-tabla-sub">Disponible desde {fmtFecha(e1m.disponible_desde)}</div>
                        )}
                    </div>
                </section>
            )}

            <section className="ri-card">
                <div className="ri-card-titulo">Datos del colaborador</div>
                <div className="ri-grid ri-grid-lectura">
                    <div><div className="ri-label">Sector</div>{fmt(roadmap.sector)}</div>
                    <div><div className="ri-label">Planta</div>{fmt(roadmap.planta)}</div>
                    <div><div className="ri-label">Fecha de ingreso</div>{fmtFecha(roadmap.fecha_ingreso)}</div>
                    <div><div className="ri-label">Jefe directo</div>{fmt(roadmap.jefe_directo)}</div>
                    <div><div className="ri-label">Tutor RRHH</div>{fmt(roadmap.tutor_rrhh)}</div>
                </div>
            </section>

            <section className="ri-card">
                <div className="ri-card-titulo">Roadmap</div>
                {borrador && (
                    <div className="ri-alerta">El roadmap está en borrador: publicalo para que el colaborador lo vea y poder registrar inducciones completadas.</div>
                )}
                <RoadmapTimeline
                    items={roadmap.items}
                    encuestaCompletada={roadmap.encuesta_completada}
                    encuestaFecha={roadmap.encuesta_fecha}
                    encuesta1Mes={e1m}
                    onToggle={borrador ? null : onToggleItem}
                    onToggleEvaluacion={borrador ? null : onToggleEvaluacion}
                    onToggleEncuesta1Mes={borrador ? null : onToggleEncuesta1Mes}
                    deshabilitado={guardando}
                />
            </section>

            {roadmap.encuesta_completada && encuesta && (
                <section className="ri-card">
                    <div className="ri-card-titulo">Resultado de la encuesta</div>
                    <div className="ri-estrellas lectura">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} className={n <= encuesta.puntaje ? 'activa' : ''}>★</span>
                        ))}
                    </div>
                    <p className="ri-encuesta-texto">{encuesta.comentarios || 'Sin comentarios.'}</p>
                </section>
            )}
        </div>
    );
}

export default DetalleRoadmap;
