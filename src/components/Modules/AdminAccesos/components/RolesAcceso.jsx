import { useState } from 'react';
import { LINK_ADMIN_ACCESOS, MAX_SUGERENCIAS_ROLES, NOMBRE_GRUPO_ADMIN, NOMBRE_ROL_TODOS } from '../constants';

// Roles (grupousuario) que pueden ver la solapa (web.intranet_menu_roles).
function RolesAcceso({ acceso, roles, guardando, onAgregar, onQuitar }) {
    const [busqueda, setBusqueda] = useState('');

    const asignados = new Set(acceso.roles.map(r => r.id));
    const texto = busqueda.trim().toLowerCase();
    const sugerencias = texto
        ? roles.filter(r => !asignados.has(r.id) && r.nombre.toLowerCase().includes(texto)).slice(0, MAX_SUGERENCIAS_ROLES)
        : [];

    const esProtegido = (rol) => acceso.link === LINK_ADMIN_ACCESOS && rol.nombre === NOMBRE_GRUPO_ADMIN;
    const esPublico = acceso.roles.some(r => r.nombre === NOMBRE_ROL_TODOS);

    const agregar = async (rol) => {
        await onAgregar(rol);
        setBusqueda('');
    };

    return (
        <div className="aa-card">
            <div className="aa-card-titulo">Roles con acceso</div>

            {acceso.roles.length === 0 ? (
                <div className="aa-alerta">La solapa no tiene roles asignados: no la ve ningún usuario.</div>
            ) : esPublico ? (
                <div className="aa-info">Tiene el rol <strong>{NOMBRE_ROL_TODOS}</strong>: la solapa es visible para todos los usuarios.</div>
            ) : null}

            <div className="aa-roles">
                {acceso.roles.map(rol => (
                    <span key={rol.id} className={`aa-rol ${rol.nombre === NOMBRE_ROL_TODOS ? 'todos' : ''}`}>
                        {rol.nombre}
                        {!rol.activo && <small> (inactivo)</small>}
                        {!esProtegido(rol) && (
                            <button type="button" className="aa-rol-quitar" title="Quitar rol" disabled={guardando}
                                    onClick={() => onQuitar(rol)}>
                                <i className="material-symbols-outlined">close</i>
                            </button>
                        )}
                    </span>
                ))}
            </div>

            <div className="aa-agregar">
                <label className="aa-label">Agregar rol</label>
                <input className="aa-input" placeholder="Buscar rol por nombre..." value={busqueda}
                       onChange={(e) => setBusqueda(e.target.value)} />
                {texto && (
                    sugerencias.length === 0 ? (
                        <div className="aa-nota">No hay roles sin asignar que coincidan.</div>
                    ) : (
                        <ul className="aa-sugerencias">
                            {sugerencias.map(rol => (
                                <li key={rol.id}>
                                    <button type="button" disabled={guardando} onClick={() => agregar(rol)}>
                                        <span>
                                            {rol.nombre}
                                            {!rol.activo && <small> (inactivo)</small>}
                                        </span>
                                        <span className="aa-tabla-sub">{rol.miembros} usuario{rol.miembros === 1 ? '' : 's'}</span>
                                        <i className="material-symbols-outlined">add</i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </div>
    );
}

export default RolesAcceso;
