import EstadoChip from './EstadoChip';

// Matriz colaborador × herramienta para que el líder vea de un vistazo qué le falta por persona.
export default function EquipoTabla({ equipo }) {
    return (
        <div className="tr-tabla-wrap">
            <table className="tr-tabla">
                <thead>
                    <tr>
                        <th>Colaborador</th>
                        <th>Evaluación de desempeño</th>
                        <th>Objetivos anuales</th>
                        <th>Guía de Potencial</th>
                        <th>Riesgo e Impacto</th>
                    </tr>
                </thead>
                <tbody>
                    {equipo.map(p => (
                        <tr key={p.empleado_id}>
                            <td>
                                <div className="tr-tabla-nombre">{p.nombre}</div>
                                <div className="tr-tabla-puesto">
                                    {p.puesto}
                                    {!p.entra_9box && <span className="tr-tabla-nota"> · No entra al 9-box (antigüedad)</span>}
                                </div>
                            </td>
                            <td>
                                {p.evaluacion_link ? (
                                    <a href={`/evaluacion-desempenio/${p.evaluacion_link.cuestionario_id}/${p.evaluacion_link.usuario_evaluar}`}>
                                        <EstadoChip estado={p.evaluacion} />
                                    </a>
                                ) : <EstadoChip estado={p.evaluacion} />}
                            </td>
                            <td><EstadoChip estado={p.objetivos} /></td>
                            <td><EstadoChip estado={p.guia_potencial} /></td>
                            <td><EstadoChip estado={p.riesgo_impacto} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
