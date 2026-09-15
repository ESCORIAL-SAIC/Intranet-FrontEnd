function AgenteSelector({ agentes, agenteKey, onSelect }) {
    return (
        <div className="arh-agentes">
            <div className="arh-sidebar-titulo">Asistentes</div>
            {agentes.map(a => (
                <button
                    key={a.key}
                    className={`arh-agente-item ${a.key === agenteKey ? 'arh-agente-activo' : ''}`}
                    onClick={() => onSelect(a.key)}
                    title={a.descripcion}
                >
                    <span className="arh-agente-nombre">{a.nombre}</span>
                    <span className="arh-agente-desc">{a.descripcion}</span>
                </button>
            ))}
            {agentes.length === 0 && <div className="arh-sin-datos">Cargando asistentes...</div>}
        </div>
    );
}

export default AgenteSelector;
