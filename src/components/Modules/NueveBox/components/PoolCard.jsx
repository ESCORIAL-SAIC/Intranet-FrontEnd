import { initials } from '../utils';

export default function PoolCard({ person, canEdit, onDragStart }) {
  return (
    <button
      className={`person pool-card ${canEdit ? 'draggable' : ''}`}
      type="button"
      draggable={canEdit}
      onDragStart={onDragStart}
    >
      <div className="person-top">
        <div className="avatar" style={{ background: 'var(--ink)' }}>
          {initials(person.empleado_nombre)}
        </div>
        <div>
          <h3>{person.empleado_nombre}</h3>
          <p className="role">{person.puesto}</p>
        </div>
      </div>
    </button>
  );
}