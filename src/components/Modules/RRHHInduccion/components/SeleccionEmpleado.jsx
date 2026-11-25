import { useState } from 'react';
import { OPCIONES_DIAS_NUEVOS } from '../constants';
import { fmt, fmtFecha } from '../utils';

// Paso previo a crear un roadmap: listado de colaboradores con ingreso reciente.
function SeleccionEmpleado({ empleados, dias, cargando, onCambiarDias, onSeleccionar, onVerRoadmap }) {
    const [busqueda, setBusqueda] = useState('');

    const filtro = busqueda.trim().toLowerCase();
    const filtrados = empleados.filter(e =>
        !filtro
        || (e.nombre || '').toLowerCase().includes(filtro)
        || String(e.legajo || '').toLowerCase().includes(filtro)
        || (e.puesto || '').toLowerCase().includes(filtro)
    );

    return (
        <div>
            <div className="ri-card">
                <div className="ri-card-titulo">Seleccionar colaborador</div>
                <div className="ri-filtros">
                    <input className="ri-input" placeholder="Buscar por nombre, legajo o puesto"
                           value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    <label className="ri-filtro-dias">
                        Ingresos de los últimos
                        <select className="ri-input" value={dias} onChange={(e) => onCambiarDias(parseInt(e.target.value, 10))}>
                            {OPCIONES_DIAS_NUEVOS.map(d => <option key={d} value={d}>{d} días</option>)}
                        </select>
                    </label>
                </div>
                <div className="ri-info">
                    Se listan los colaboradores activos dados de alta con fecha de ingreso dentro del período seleccionado.
                </div>
            </div>

            {cargando ? (
                <div className="ri-vacio">Cargando colaboradores...</div>
            ) : filtrados.length === 0 ? (
                <div className="ri-vacio">No hay colaboradores con ingreso reciente.</div>
            ) : (
                <div className="ri-tabla-wrap">
                    <table className="ri-tabla">
                        <thead>
                            <tr>
                                <th>Colaborador</th>
                                <th>Legajo</th>
                                <th>Puesto</th>
                                <th>Sector</th>
                                <th>Ingreso</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(e => (
                                <tr key={e.id}>
                                    <td>{fmt(e.nombre)}</td>
                                    <td>{fmt(e.legajo)}</td>
                                    <td>{fmt(e.puesto)}</td>
                                    <td>{fmt(e.sector)}</td>
                                    <td>{fmtFecha(e.fecha_ingreso)}</td>
                                    <td className="ri-tabla-acciones">
                                        {e.roadmap_id ? (
                                            <button type="button" className="ri-boton-secundario" onClick={() => onVerRoadmap(e.roadmap_id)}>
                                                Ver roadmap
                                            </button>
                                        ) : (
                                            <button type="button" className="ri-boton-primario" onClick={() => onSeleccionar(e)}>
                                                Crear roadmap
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SeleccionEmpleado;
