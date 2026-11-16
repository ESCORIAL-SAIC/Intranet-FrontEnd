import { useState } from 'react';
import PilaresForm from './PilaresForm';
import EmpleadosSelector from './EmpleadosSelector';
import { PILAR_VACIO } from '../constants';
import { pilaresListosParaGuardar } from '../utils';

// Alta de registros (ciclo anual): se eligen uno o varios empleados + año y se definen los
// pilares iniciales; se crea un registro por empleado con los mismos pilares.
// Sólo accesible para Dirección/administradores/RRHH.
function NuevoRegistroForm({ buscarEmpleados, onCrear, onCancelar, guardando, mensaje }) {
    const [empleados, setEmpleados] = useState([]);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [evaluador, setEvaluador] = useState('');
    const [pilares, setPilares] = useState([{ ...PILAR_VACIO }]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (empleados.length === 0 || !anio) return;
        if (!pilaresListosParaGuardar(pilares)) return;
        onCrear({ empleado_ids: empleados.map(e => e.empleado_id), anio: Number(anio), evaluador, pilares });
    };

    return (
        <form className="oa-nuevo-registro-form" onSubmit={handleSubmit}>
            <div className="oa-person-card">
                <div className="oa-person-grid">
                    <div className="oa-field oa-field-empleados">
                        <label className="oa-field-label">
                            Empleados{empleados.length > 0 && ` (${empleados.length} seleccionado${empleados.length === 1 ? '' : 's'})`}
                        </label>
                        <EmpleadosSelector seleccionados={empleados} onChange={setEmpleados} buscar={buscarEmpleados} />
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
                <button type="submit" className="oa-boton-guardar" disabled={guardando || empleados.length === 0 || !pilaresListosParaGuardar(pilares)}>
                    {guardando ? 'Creando...' : empleados.length > 1 ? `Crear ${empleados.length} registros` : 'Crear registro'}
                </button>
                <button type="button" className="oa-boton-limpiar" onClick={onCancelar} disabled={guardando}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default NuevoRegistroForm;
