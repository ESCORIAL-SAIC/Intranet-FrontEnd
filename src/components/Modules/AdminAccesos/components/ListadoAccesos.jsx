import { useState } from 'react';
import { NOMBRE_ROL_TODOS } from '../constants';

function ListadoAccesos({ accesos, cargando, onVer, onNuevo }) {
    const [filtro, setFiltro] = useState('');

    const texto = filtro.trim().toLowerCase();
    const visibles = texto
        ? accesos.filter(a => [a.name, a.link, ...a.roles.map(r => r.nombre)].some(v => (v || '').toLowerCase().includes(texto)))
        : accesos;

    return (
        <div>
            <div className="aa-toolbar">
                <input className="aa-input" placeholder="Buscar por nombre, link o rol..." value={filtro}
                       onChange={(e) => setFiltro(e.target.value)} />
                <button type="button" className="aa-boton-primario" onClick={onNuevo}>
                    <i className="material-symbols-outlined">add</i> Nuevo acceso
                </button>
            </div>

            {cargando ? (
                <div className="aa-vacio">Cargando accesos...</div>
            ) : visibles.length === 0 ? (
                <div className="aa-vacio">{accesos.length === 0 ? 'Todavía no hay accesos cargados.' : 'Ningún acceso coincide con la búsqueda.'}</div>
            ) : (
                <div className="aa-tabla-wrap">
                    <table className="aa-tabla">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Acceso</th>
                                <th>Link</th>
                                <th>Roles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibles.map(a => (
                                <tr key={a.id} className="aa-tabla-fila" onClick={() => onVer(a)}>
                                    <td>{a.orden ?? '-'}</td>
                                    <td>
                                        <div className="aa-acceso-nombre">
                                            <i className="material-symbols-outlined">{a.img_icon || 'link'}</i>
                                            {a.name}
                                        </div>
                                    </td>
                                    <td className="aa-tabla-link">{a.link}</td>
                                    <td>
                                        {a.roles.length === 0 ? (
                                            <span className="aa-chip sin-roles">Sin roles (no visible)</span>
                                        ) : (
                                            <div className="aa-chips">
                                                {a.roles.map(r => (
                                                    <span key={r.id} className={`aa-chip ${r.nombre === NOMBRE_ROL_TODOS ? 'todos' : ''}`}>{r.nombre}</span>
                                                ))}
                                            </div>
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

export default ListadoAccesos;
