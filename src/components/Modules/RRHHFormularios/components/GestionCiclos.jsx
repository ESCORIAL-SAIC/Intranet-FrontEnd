import { useState } from 'react';

function formatFecha(fecha) {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

function esVigente(ciclo) {
    const hoy = new Date().toISOString().substring(0, 10);
    const desde = String(ciclo.fecha_desde).substring(0, 10);
    const hasta = String(ciclo.fecha_hasta).substring(0, 10);
    return hoy >= desde && hoy <= hasta;
}

// Gestión de ciclos (ventanas de fechas) para RRHH/Dirección/administradores — mientras un
// ciclo está vigente, los líderes pueden completar el formulario correspondiente para sus
// reportes directos.
function GestionCiclos({ ciclos, onCrear, onEditar, onEliminar, guardando }) {
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const limpiar = () => {
        setMostrarForm(false);
        setEditandoId(null);
        setNombre('');
        setFechaDesde('');
        setFechaHasta('');
    };

    const iniciarEdicion = (ciclo) => {
        setEditandoId(ciclo.id);
        setNombre(ciclo.nombre || '');
        setFechaDesde(String(ciclo.fecha_desde).substring(0, 10));
        setFechaHasta(String(ciclo.fecha_hasta).substring(0, 10));
        setMostrarForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fechaDesde || !fechaHasta) return;
        const payload = { nombre: nombre || null, fecha_desde: fechaDesde, fecha_hasta: fechaHasta };
        const ok = editandoId ? await onEditar(editandoId, payload) : await onCrear(payload);
        if (ok) limpiar();
    };

    return (
        <div className="rf-ciclos">
            {!mostrarForm && (
                <div className="rf-toolbar">
                    <button type="button" className="rf-boton-guardar" onClick={() => setMostrarForm(true)}>
                        <i className="material-symbols-outlined">add</i> Nuevo ciclo
                    </button>
                </div>
            )}

            {mostrarForm && (
                <form className="rf-ciclo-form" onSubmit={handleSubmit}>
                    <div className="rf-person-grid">
                        <div className="rf-field">
                            <label className="rf-field-label">Nombre (opcional)</label>
                            <input className="rf-field-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Ciclo 2026" />
                        </div>
                        <div className="rf-field">
                            <label className="rf-field-label">Vigente desde</label>
                            <input className="rf-field-input" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} required />
                        </div>
                        <div className="rf-field">
                            <label className="rf-field-label">Vigente hasta</label>
                            <input className="rf-field-input" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} required />
                        </div>
                    </div>
                    <div className="rf-form-botones">
                        <button type="submit" className="rf-boton-guardar" disabled={guardando || !fechaDesde || !fechaHasta}>
                            {editandoId ? 'Guardar cambios' : 'Crear ciclo'}
                        </button>
                        <button type="button" className="rf-boton-limpiar" onClick={limpiar} disabled={guardando}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {ciclos.length === 0 ? (
                <div className="rf-vacio">Todavía no hay ciclos creados para este formulario.</div>
            ) : (
                <div className="rf-registro-list-wrap">
                    <table className="rf-registro-list">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Desde</th>
                                <th>Hasta</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ciclos.map(ciclo => (
                                <tr key={ciclo.id} className="rf-registro-list-fila-estatica">
                                    <td>{ciclo.nombre || '—'}</td>
                                    <td>{formatFecha(ciclo.fecha_desde)}</td>
                                    <td>{formatFecha(ciclo.fecha_hasta)}</td>
                                    <td>
                                        <span className={`rf-estado-badge ${esVigente(ciclo) ? 'estado-finalizado' : ''}`}>
                                            {esVigente(ciclo) ? 'Vigente' : 'Cerrado'}
                                        </span>
                                    </td>
                                    <td className="rf-registro-list-acciones">
                                        <button type="button" className="rf-boton-secundario" disabled={guardando} onClick={() => iniciarEdicion(ciclo)}>
                                            Editar
                                        </button>
                                        {' '}
                                        <button type="button" className="rf-boton-icono" disabled={guardando} onClick={() => onEliminar(ciclo.id)}>
                                            <i className="material-symbols-outlined">delete</i>
                                        </button>
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

export default GestionCiclos;
