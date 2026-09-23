import { useState, useEffect } from 'react';
import axios from 'axios';

// Alta manual para casos excepcionales (RRHH/Dirección/administradores) — el flujo normal
// para un líder es completar el formulario desde "Pendientes". El cuestionario completo se
// responde en la vista de detalle inmediatamente después de crear el registro (en borrador).
function NuevoRiesgoImpactoForm({ empleados, busqueda, onBuscar, onCrear, onCancelar, guardando, mensaje, baseURL, axiosConfig, tipo }) {
    const [empleadoId, setEmpleadoId] = useState('');
    const [cicloId, setCicloId] = useState('');
    const [ciclos, setCiclos] = useState([]);
    const [evaluador, setEvaluador] = useState('');
    const [antiguedad, setAntiguedad] = useState('');
    const [fecha, setFecha] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${baseURL}/rrhh-formularios/ciclos/${tipo}`, axiosConfig);
                setCiclos(response.data.ciclos || []);
            } catch (err) {
                console.log(err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!empleadoId || !cicloId) return;
        onCrear({ empleado_id: empleadoId, ciclo_id: cicloId, evaluador, antiguedad, fecha: fecha || null });
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
                        <label className="rf-field-label">Ciclo</label>
                        <select className="rf-field-input" value={cicloId} onChange={(e) => setCicloId(e.target.value)} required>
                            <option value="">Seleccioná un ciclo</option>
                            {ciclos.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre ? `${c.nombre} — ` : ''}{String(c.fecha_desde).substring(0, 10)} al {String(c.fecha_hasta).substring(0, 10)}</option>
                            ))}
                        </select>
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
                <button type="submit" className="rf-boton-guardar" disabled={guardando || !empleadoId || !cicloId}>
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
