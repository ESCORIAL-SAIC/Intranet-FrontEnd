import { ESTADOS } from '../constants';
import { fmt } from '../utils';

function formatFecha(fecha) {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

// Pendientes del líder logueado: sus reportes directos (1 solo nivel) para el ciclo
// actualmente vigente de este tipo de formulario. Sin ciclo abierto, no hay nada para
// completar todavía.
function PendientesFormulario({ ciclo, items, onCompletar, onVer, guardando }) {
    if (!ciclo) {
        return <div className="rf-vacio">No hay un ciclo abierto para completar este formulario. RRHH debe abrir uno desde la solapa "Ciclos".</div>;
    }

    return (
        <div className="rf-pendientes">
            <div className="rf-ciclo-banner">
                <div>
                    <div className="rf-ciclo-banner-label">Ciclo vigente{ciclo.nombre ? ` — ${ciclo.nombre}` : ''}</div>
                    <div className="rf-ciclo-banner-fechas">{formatFecha(ciclo.fecha_desde)} al {formatFecha(ciclo.fecha_hasta)}</div>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="rf-vacio">No tenés reportes directos a cargo.</div>
            ) : (
                <div className="rf-registro-list-wrap">
                    <table className="rf-registro-list">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Puesto</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => {
                                const info = ESTADOS[item.estado] || { label: item.estado, className: '' };
                                return (
                                    <tr key={item.empleado_id} className="rf-registro-list-fila-estatica">
                                        <td>{fmt(item.empleado_nombre)}</td>
                                        <td>{fmt(item.puesto)}</td>
                                        <td><span className={`rf-estado-badge ${info.className}`}>{info.label}</span></td>
                                        <td>
                                            {item.registro_id ? (
                                                <button type="button" className="rf-boton-secundario" disabled={guardando} onClick={() => onVer(item.registro_id)}>
                                                    {item.estado === 'finalizado' ? 'Ver' : 'Continuar'}
                                                </button>
                                            ) : (
                                                <button type="button" className="rf-boton-guardar" disabled={guardando} onClick={() => onCompletar(item.empleado_id)}>
                                                    Completar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PendientesFormulario;
