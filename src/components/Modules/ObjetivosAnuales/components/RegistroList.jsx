import EstadoBadge from './EstadoBadge';
import { fmt } from '../utils';

// Listado de registros — sólo visible para Dirección/administradores/RRHH.
function RegistroList({ registros, onSeleccionar }) {
    if (registros.length === 0) {
        return <div className="oa-vacio">Todavía no hay registros de Objetivos Anuales cargados.</div>;
    }

    return (
        <div className="oa-registro-list-wrap">
            <table className="oa-registro-list">
                <thead>
                    <tr>
                        <th>Empleado</th>
                        <th>Área</th>
                        <th>Año</th>
                        <th>Estado</th>
                        <th>Puntaje final</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map(r => (
                        <tr key={r.id} className="oa-registro-list-fila" onClick={() => onSeleccionar(r.id)}>
                            <td>{fmt(r.empleado_nombre)}</td>
                            <td>{fmt(r.area || r.gerencia)}</td>
                            <td>{r.anio}</td>
                            <td><EstadoBadge estado={r.estado} /></td>
                            <td className="oa-registro-list-puntaje">{fmt(r.puntaje_final)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RegistroList;
