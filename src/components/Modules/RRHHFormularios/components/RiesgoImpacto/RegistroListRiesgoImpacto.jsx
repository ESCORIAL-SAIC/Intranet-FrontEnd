import EstadoBadge from '../EstadoBadge';
import { fmt } from '../../utils';

function RegistroListRiesgoImpacto({ registros, onSeleccionar }) {
    if (registros.length === 0) {
        return <div className="rf-vacio">Todavía no hay registros de Riesgo e Impacto de Pérdida cargados.</div>;
    }

    return (
        <div className="rf-registro-list-wrap">
            <table className="rf-registro-list">
                <thead>
                    <tr>
                        <th>Empleado</th>
                        <th>Área</th>
                        <th>Ciclo</th>
                        <th>Evaluador</th>
                        <th>Cargado por</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map(r => (
                        <tr key={r.id} className="rf-registro-list-fila" onClick={() => onSeleccionar(r.id)}>
                            <td>{fmt(r.empleado_nombre)}</td>
                            <td>{fmt(r.area || r.gerencia)}</td>
                            <td>{fmt(r.ciclo_nombre, r.anio)}</td>
                            <td>{fmt(r.evaluador)}</td>
                            <td>{fmt(r.creado_por)}</td>
                            <td><EstadoBadge estado={r.estado} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RegistroListRiesgoImpacto;
