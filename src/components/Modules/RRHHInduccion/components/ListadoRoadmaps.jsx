import { ESTADOS_ROADMAP, TIPOS_INDUCCION } from '../constants';
import { fmt, fmtFecha } from '../utils';

function EstadoRoadmap({ estado }) {
    const info = ESTADOS_ROADMAP[estado] || { label: estado, className: '' };
    return <span className={`ri-chip ${info.className}`}>{info.label}</span>;
}

function ListadoRoadmaps({ roadmaps, cargando, onVer, onNuevo }) {
    const labelTipo = (tipo) => (TIPOS_INDUCCION.find(t => t.value === tipo) || {}).label || tipo;

    return (
        <div>
            <div className="ri-toolbar">
                <button type="button" className="ri-boton-primario" onClick={onNuevo}>
                    <i className="material-symbols-outlined">add</i> Nuevo roadmap
                </button>
            </div>

            {cargando ? (
                <div className="ri-vacio">Cargando roadmaps...</div>
            ) : roadmaps.length === 0 ? (
                <div className="ri-vacio">Todavía no se creó ningún roadmap de inducción.</div>
            ) : (
                <div className="ri-tabla-wrap">
                    <table className="ri-tabla">
                        <thead>
                            <tr>
                                <th>Colaborador</th>
                                <th>Puesto</th>
                                <th>Tipo</th>
                                <th>Ingreso</th>
                                <th>Próxima inducción</th>
                                <th>Avance</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roadmaps.map(r => (
                                <tr key={r.id} className="ri-tabla-fila" onClick={() => onVer(r.id)}>
                                    <td>
                                        <div>{fmt(r.nombre_snapshot)}</div>
                                        <div className="ri-tabla-sub">Legajo {fmt(r.legajo_snapshot)}</div>
                                    </td>
                                    <td>{fmt(r.puesto_snapshot)}</td>
                                    <td>{labelTipo(r.tipo)}</td>
                                    <td>{fmtFecha(r.fecha_ingreso)}</td>
                                    <td>{fmtFecha(r.proxima_fecha)}</td>
                                    <td>
                                        <div className="ri-mini-barra">
                                            <div style={{ width: `${r.progreso.porcentaje}%` }}></div>
                                        </div>
                                        <div className="ri-tabla-sub">{r.progreso.completadas}/{r.progreso.total} · {r.progreso.porcentaje}%</div>
                                    </td>
                                    <td><EstadoRoadmap estado={r.estado} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export { EstadoRoadmap };
export default ListadoRoadmaps;
