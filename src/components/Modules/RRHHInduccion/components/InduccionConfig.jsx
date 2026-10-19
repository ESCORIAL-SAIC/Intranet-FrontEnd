import { EVALUACIONES } from '../constants';
import SelectorEmpleado from './SelectorEmpleado';

// Tarjeta de configuración de una inducción dentro del roadmap (sección 3 del maquetado).
// La tarjeta solo se vuelve arrastrable al agarrarla desde el ícono ☷ (onAgarrar), para no
// interferir con la selección de texto en los inputs.
function InduccionConfig({ item, index, onChange, onQuitar, onSubir, onBajar, esPrimera, esUltima, drag, onAgarrar }) {
    const set = (campo) => (e) => onChange({ ...item, [campo]: e.target.value });
    const evaluacion = EVALUACIONES[item.evaluacion_tipo];

    return (
        <div className={`ri-induccion ${item.completada ? 'completada' : ''}`} {...drag}>
            <div className="ri-induccion-header">
                <div className="ri-drag" title="Arrastrar para reordenar" onMouseDown={onAgarrar}>☷</div>
                <div className="ri-numero">{index + 1}</div>
                <input className="ri-induccion-nombre" value={item.nombre} onChange={set('nombre')} />
                {item.completada && <span className="ri-chip item-completada">Completada</span>}
                <button type="button" className="ri-boton-icono" disabled={esPrimera} onClick={onSubir} title="Subir">
                    <i className="material-symbols-outlined">arrow_upward</i>
                </button>
                <button type="button" className="ri-boton-icono" disabled={esUltima} onClick={onBajar} title="Bajar">
                    <i className="material-symbols-outlined">arrow_downward</i>
                </button>
                <button type="button" className="ri-quitar" onClick={onQuitar}>Quitar</button>
            </div>

            <div className="ri-induccion-campos">
                <div>
                    <label className="ri-label">Fecha</label>
                    <input className="ri-input" type="date" value={item.fecha || ''} onChange={set('fecha')} />
                </div>
                <div>
                    <label className="ri-label">Horario</label>
                    <input className="ri-input" type="time" value={item.horario || ''} onChange={set('horario')} />
                </div>
                <div>
                    <label className="ri-label">Duración (min)</label>
                    <input className="ri-input" type="number" min="5" step="5" value={item.duracion_min} onChange={set('duracion_min')} />
                </div>
                <div>
                    <label className="ri-label">Ubicación</label>
                    <input className="ri-input" placeholder="Ej. Sala 2" value={item.ubicacion || ''} onChange={set('ubicacion')} />
                </div>
                <div>
                    <label className="ri-label">Facilitador</label>
                    <SelectorEmpleado value={item.facilitador || ''} placeholder="Buscar por nombre o legajo"
                                      onChange={(nombre) => onChange({ ...item, facilitador: nombre })} />
                </div>
                <div>
                    <label className="ri-label">Material</label>
                    <input className="ri-input" placeholder="Link a SharePoint" value={item.material_url || ''} onChange={set('material_url')} />
                    {item.catalogo_id && <div className="ri-nota">Precargado desde el catálogo.</div>}
                </div>
                <div>
                    <label className="ri-label">Evaluación</label>
                    <select className="ri-input" value={item.evaluacion_tipo || ''} onChange={set('evaluacion_tipo')}>
                        <option value="">Sin evaluación</option>
                        {Object.entries(EVALUACIONES).map(([codigo, ev]) => (
                            <option key={codigo} value={codigo}>{ev.label}</option>
                        ))}
                    </select>
                    {evaluacion && (
                        <div className="ri-evaluacion">
                            <span>Forms</span>
                            <a href={evaluacion.url} target="_blank" rel="noreferrer">Ver formulario</a>
                        </div>
                    )}
                </div>
                <div>
                    <label className="ri-label">Observaciones</label>
                    <input className="ri-input" placeholder="Opcional" value={item.observaciones || ''} onChange={set('observaciones')} />
                </div>
            </div>
        </div>
    );
}

export default InduccionConfig;
