import { useState } from 'react';
import PilaresForm from './PilaresForm';
import { PILAR_VACIO } from '../constants';
import { pilaresListosParaGuardar } from '../utils';

// Alta de un nuevo registro (ciclo anual) para un empleado: selecciona empleado + año y define
// los pilares iniciales. Sólo accesible para Dirección/administradores/RRHH.
function NuevoRegistroForm({ empleados, busqueda, onBuscar, onCrear, onCancelar, guardando, mensaje }) {
    const [empleadoId, setEmpleadoId] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [evaluador, setEvaluador] = useState('');
    const [pilares, setPilares] = useState([{ ...PILAR_VACIO }]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!empleadoId || !anio) return;
        if (!pilaresListosParaGuardar(pilares)) return;
        onCrear({ empleado_id: Number(empleadoId), anio: Number(anio), evaluador, pilares });
    };

    return (
        <form className="oa-nuevo-registro-form" onSubmit={handleSubmit}>
            <div className="oa-person-card">
                <div className="oa-person-grid">
                    <div className="oa-field">
                        <label className="oa-field-label">Buscar empleado</label>
                        <input className="oa-field-input" type="text" value={busqueda} onChange={(e) => onBuscar(e.target.value)} placeholder="Nombre del empleado..." />
                    </div>
                    <div className="oa-field">
                        <label className="oa-field-label">Empleado seleccionado</label>
                        <select className="oa-field-input" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} required>
                            <option value="">Seleccioná un empleado</option>
                            {empleados.map(emp => (
                                <option key={emp.empleado_id} value={emp.empleado_id}>{emp.empleado} — {emp.puesto}</option>
                            ))}
                        </select>
                    </div>
                    <div className="oa-field">
                        <label className="oa-field-label">Año</label>
                        <input className="oa-field-input" type="number" value={anio} onChange={(e) => setAnio(e.target.value)} required />
                    </div>
                    <div className="oa-field">
                        <label className="oa-field-label">Evaluador</label>
                        <input className="oa-field-input" type="text" value={evaluador} onChange={(e) => setEvaluador(e.target.value)} placeholder="Nombre del evaluador" />
                    </div>
                </div>
            </div>

            <div className="oa-s-title">Objetivos por pilar</div>
            <PilaresForm pilares={pilares} onChange={setPilares} />

            {mensaje && <div className={`oa-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

            <div className="oa-form-botones">
                <button type="submit" className="oa-boton-guardar" disabled={guardando || !empleadoId || !pilaresListosParaGuardar(pilares)}>
                    {guardando ? 'Creando...' : 'Crear registro'}
                </button>
                <button type="button" className="oa-boton-limpiar" onClick={onCancelar} disabled={guardando}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default NuevoRegistroForm;
