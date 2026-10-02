import { TIPOS_INDUCCION } from '../constants';
import { fmt, fmtFecha } from '../utils';
import { EstadoRoadmap } from './ListadoRoadmaps';
import ProgresoInduccion from './ProgresoInduccion';
import RoadmapTimeline from './RoadmapTimeline';

// Vista RRHH de un roadmap: seguimiento (marcar inducciones completadas) y resultado de la encuesta.
function DetalleRoadmap({ roadmap, guardando, onToggleItem, onEditar, onEliminar }) {
    const tipo = (TIPOS_INDUCCION.find(t => t.value === roadmap.tipo) || {}).label || roadmap.tipo;
    const encuesta = roadmap.encuesta_respuestas;

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
                {roadmap.estado === 'borrador' && (
                    <div className="ri-alerta">El roadmap está en borrador: publicalo para que el colaborador lo vea y poder registrar inducciones completadas.</div>
                )}
                <RoadmapTimeline
                    items={roadmap.items}
                    encuestaCompletada={roadmap.encuesta_completada}
                    encuestaFecha={roadmap.encuesta_fecha}
                    onToggle={roadmap.estado === 'borrador' ? null : onToggleItem}
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
