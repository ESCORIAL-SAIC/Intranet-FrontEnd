import { fmt, initials } from '../utils';

export default function PersonCard({ person, isSelected, onSelect, canEdit, onDragStart, tone }) {
  return (
    <button
      className={`person ${isSelected ? 'active' : ''} ${canEdit ? 'draggable' : ''}`}
      type="button"
      onClick={onSelect}
      draggable={canEdit}
      onDragStart={onDragStart}
    >
      <div className="person-top">
        <div
          className="avatar"
          style={{
            background:
              tone === 'red' ? 'var(--red)' :
              tone === 'gray' ? 'var(--gray)' :
              tone === 'green' ? 'var(--green)' :
              'var(--blue)'
          }}
        >
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