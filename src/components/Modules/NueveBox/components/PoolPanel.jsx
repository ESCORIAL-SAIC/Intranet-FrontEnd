import PoolCard from './PoolCard';

export default function PoolPanel({ poolPeople, canEdit, estadoRegistro, onDragOver, onDragLeave, onDrop, onDragStart }) {
  const estadoColor = {
    borrador: 'var(--green)',
    calibrado: 'var(--blue)',
    publicado: 'var(--gray)'
  };
  const color = estadoColor[estadoRegistro] || 'var(--gray)';

  return (
    <section className="panel stack-panel">
      <div className="stack-head">
        <div>
          <h3>Bandeja de personas para ubicar</h3>
          <p>
            Estas personas no están asignadas a una caja. En modo Borrador podés arrastrarlas
            hacia una caja.
          </p>
        </div>
        <span className="pill status-chip" style={{ color }}>
          <span className="status-dot" style={{ background: color }}></span>
          <span>{estadoRegistro.charAt(0).toUpperCase() + estadoRegistro.slice(1)}</span>
        </span>
      </div>
      <div
        className="pool-dropzone"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="pool-head">
          <span className="pool-title">Pendientes de ubicar</span>
          <span className="pill">{poolPeople.length} personas</span>
        </div>
        <div className="pool-list">
          {poolPeople.length > 0 ? (
            poolPeople.map(person => (
              <PoolCard
                key={person.empleado_id}
                person={person}
                canEdit={canEdit}
                onDragStart={(e) => onDragStart(e, person, 'pool')}
              />
            ))
          ) : (
            <div className="empty">No hay personas pendientes de ubicar.</div>
          )}
        </div>
        <div className="pool-help">
          Podés arrastrarlas desde acá hacia cualquier tarjeta de la grilla.
        </div>
      </div>
    </section>
  );
}