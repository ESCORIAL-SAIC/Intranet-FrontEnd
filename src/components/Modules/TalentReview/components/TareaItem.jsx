import EstadoChip from './EstadoChip';
import { ESTADOS_OK } from '../constants';

// Fila del checklist: ícono de estado, descripción, progreso opcional (x de y) y acción.
export default function TareaItem({ icono, titulo, descripcion, estado, progreso, accion, children }) {
    const hecho = ESTADOS_OK.includes(estado);
    return (
        <li className={`tr-tarea ${hecho ? 'hecha' : ''} ${estado === 'bloqueado' || estado === 'no_disponible' ? 'inactiva' : ''}`}>
            <span className="material-symbols-outlined tr-tarea-check">
                {hecho ? 'check_circle' : estado === 'bloqueado' ? 'lock' : icono}
            </span>
            <div className="tr-tarea-cuerpo">
                <div className="tr-tarea-titulo">
                    {titulo}
                    <EstadoChip estado={estado} />
                </div>
                {descripcion && <p className="tr-tarea-desc">{descripcion}</p>}
                {progreso && progreso.total > 0 && (
                    <div className="tr-progreso">
                        <div className="tr-progreso-barra">
                            <span style={{ width: `${Math.round((progreso.completos / progreso.total) * 100)}%` }} />
                        </div>
                        <span className="tr-progreso-txt">{progreso.completos} de {progreso.total}</span>
                    </div>
                )}
                {children}
            </div>
            {accion && (
                <button className="tr-btn" onClick={accion.onClick} disabled={accion.disabled}>
                    {accion.label}
                </button>
            )}
        </li>
    );
}
