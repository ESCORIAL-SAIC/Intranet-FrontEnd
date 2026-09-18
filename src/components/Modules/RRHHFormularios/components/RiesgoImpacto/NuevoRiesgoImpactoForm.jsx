import { useState } from 'react';

// Alta de un nuevo registro (ciclo anual) para un empleado. El cuestionario completo se
// responde en la vista de detalle inmediatamente después de crear el registro (en borrador).
function NuevoRiesgoImpactoForm({ empleados, busqueda, onBuscar, onCrear, onCancelar, guardando, mensaje }) {
    const [empleadoId, setEmpleadoId] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [evaluador, setEvaluador] = useState('');
    const [antiguedad, setAntiguedad] = useState('');
    const [fecha, setFecha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!empleadoId || !anio) return;
        onCrear({ empleado_id: Number(empleadoId), anio: Number(anio), evaluador, antiguedad, fecha: fecha || null });
    };

    return (
        <form className="rf-nuevo-registro-form" onSubmit={handleSubmit}>
            <div className="rf-person-card">
                <div className="rf-person-grid">
                    <div className="rf-field">
                        <label className="rf-field-label">Buscar empleado</label>
                        <input className="rf-field-input" type="text" value={busqueda} onChange={(e) => onBuscar(e.target.value)} placeholder="Nombre del empleado..." />
                    </div>
                    <div className="rf-field">
                        <label className="rf-field-label">Empleado seleccionado</label>
                        <select className="rf-field-input" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} required>
                            <option value="">Seleccioná un empleado</option>
                            {empleados.map(emp => (
                                <option key={emp.empleado_id} value={emp.empleado_id}>{emp.empleado} — {emp.puesto}</option>
                            ))}
                        </select>
                    </div>
                    <div className="rf-field">
                        <label className="rf-field-label">Año</label>
                        <input className="rf-field-input" type="number" value={anio} onChange={(e) => setAnio(e.target.value)} required />
                    </div>
                    <div className="rf-field">
                        <label className="rf-field-label">Evaluador (líder)</label>
                        <input className="rf-field-input" type="text" value={evaluador} onChange={(e) => setEvaluador(e.target.value)} placeholder="Nombre del evaluador" />
                    </div>
                    <div className="rf-field">
                        <label className="rf-field-label">Antigüedad en la empresa</label>
                        <input className="rf-field-input" type="text" value={antiguedad} onChange={(e) => setAntiguedad(e.target.value)} placeholder="Ej: 4 años" />
                    </div>
                    <div className="rf-field">
                        <label className="rf-field-label">Fecha</label>
                        <input className="rf-field-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                    </div>
                </div>
            </div>

            {mensaje && <div className={`rf-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

            <div className="rf-form-botones">
                <button type="submit" className="rf-boton-guardar" disabled={guardando || !empleadoId}>
                    {guardando ? 'Creando...' : 'Crear registro'}
                </button>
                <button type="button" className="rf-boton-limpiar" onClick={onCancelar} disabled={guardando}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default NuevoRiesgoImpactoForm;
