import { useState } from 'react';
import { ACCESO_VACIO, LINK_ADMIN_ACCESOS } from '../constants';

// Alta / edición de los datos de una solapa (web.intranet_menu).
function FormAcceso({ acceso, guardando, onGuardar, onCancelar, onEliminar }) {
    const [datos, setDatos] = useState(() => acceso
        ? { name: acceso.name || '', link: acceso.link || '', img_icon: acceso.img_icon || '',
            button_color: acceso.button_color || 'ffffff', orden: acceso.orden ?? '' }
        : ACCESO_VACIO);

    const esSolapaAdmin = acceso && acceso.link === LINK_ADMIN_ACCESOS;
    const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

    const enviar = (e) => {
        e.preventDefault();
        onGuardar(datos);
    };

    return (
        <form className="aa-card" onSubmit={enviar}>
            <div className="aa-card-titulo">{acceso ? 'Datos del acceso' : 'Nuevo acceso'}</div>
            <div className="aa-grid">
                <div>
                    <label className="aa-label">Nombre *</label>
                    <input className="aa-input" value={datos.name} onChange={cambiar('name')} placeholder="Ej: EVALUACIONES" required />
                </div>
                <div>
                    <label className="aa-label">Link *</label>
                    <input className="aa-input" value={datos.link} onChange={cambiar('link')} placeholder="/ruta-interna o https://..."
                           readOnly={esSolapaAdmin} required />
                    <div className="aa-nota">Ruta de la intranet (empieza con /) o URL externa.</div>
                </div>
                <div>
                    <label className="aa-label">Orden</label>
                    <input className="aa-input" type="number" step="any" value={datos.orden} onChange={cambiar('orden')} />
                    <div className="aa-nota">Posición en el menú (menor = más arriba).</div>
                </div>
                <div>
                    <label className="aa-label">Ícono</label>
                    <div className="aa-input-icono">
                        <i className="material-symbols-outlined">{datos.img_icon || 'link'}</i>
                        <input className="aa-input" value={datos.img_icon} onChange={cambiar('img_icon')} placeholder="Ej: dashboard" />
                    </div>
                    <div className="aa-nota">
                        Nombre de un ícono de <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">Material Symbols</a>.
                    </div>
                </div>
                <div>
                    <label className="aa-label">Color del botón</label>
                    <div className="aa-input-icono">
                        <input type="color" className="aa-color" value={`#${datos.button_color || 'ffffff'}`}
                               onChange={(e) => setDatos({ ...datos, button_color: e.target.value.replace('#', '') })} />
                        <input className="aa-input" value={datos.button_color} onChange={cambiar('button_color')} maxLength={7} />
                    </div>
                </div>
            </div>

            <div className="aa-acciones">
                {acceso && !esSolapaAdmin && (
                    <button type="button" className="aa-boton aa-boton-peligro" disabled={guardando} onClick={onEliminar}>
                        <i className="material-symbols-outlined">delete</i> Eliminar acceso
                    </button>
                )}
                <span className="aa-espaciador"></span>
                <button type="button" className="aa-boton" disabled={guardando} onClick={onCancelar}>Volver</button>
                <button type="submit" className="aa-boton-primario" disabled={guardando}>
                    <i className="material-symbols-outlined">save</i> {acceso ? 'Guardar cambios' : 'Crear acceso'}
                </button>
            </div>
        </form>
    );
}

export default FormAcceso;
