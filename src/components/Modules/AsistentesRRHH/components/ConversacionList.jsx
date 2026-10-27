function formatFecha(fechaStr) {
    if (!fechaStr) return '';
    const d = new Date(fechaStr);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function ConversacionList({ conversaciones, conversacionId, loading, onSelect, onNueva, onEliminar }) {
    return (
        <div className="arh-conversaciones">
            <div className="arh-sidebar-titulo">Conversaciones</div>
            <button className="arh-btn-nueva" onClick={onNueva}>+ Nueva conversación</button>

            {loading && <div className="arh-sin-datos">Cargando...</div>}

            {!loading && conversaciones.length === 0 && (
                <div className="arh-sin-datos">Todavía no hay conversaciones con este asistente.</div>
            )}

            <div className="arh-conversaciones-list">
                {conversaciones.map(c => (
                    <div
                        key={c.id}
                        className={`arh-conversacion-item ${c.id === conversacionId ? 'arh-conversacion-activa' : ''}`}
                        onClick={() => onSelect(c.id)}
                    >
                        <div className="arh-conversacion-titulo">{c.titulo}</div>
                        <div className="arh-conversacion-fecha">{formatFecha(c.fecha_actualizacion)}</div>
                        <button
                            className="arh-conversacion-borrar"
                            title="Eliminar conversación"
                            onClick={(e) => { e.stopPropagation(); onEliminar(c.id); }}
                        >
                            <i className="material-symbols-outlined">delete</i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConversacionList;
