import { BOX_META, CELL_ORDER } from '../constants';
import { getCaja } from '../utils';
import PersonCard from './PersonCard';

export default function BoxGrid({ filtered, canEdit, selectedPersonId, onSelectPerson, onDragOver, onDragLeave, onDropOnCell, onDragStart }) {
  return (
    <section className="panel matrix">
      <div className="matrix-head">
        <div>
          <h2>Grilla 9-Box</h2>
          <p>Las tarjetas se ubican automáticamente según la combinación de desempeño y potencial.</p>
        </div>
        <span className="pill">{filtered.length} personas visibles</span>
      </div>
      <div className="grid-wrap">
        {CELL_ORDER.map(cell => {
          const cellPeople = filtered.filter(p => getCaja(p) === cell.box);
          const meta = BOX_META[cell.box];
          return (
            <article
              key={cell.box}
              className={`cell ${meta.tone} ${canEdit ? 'droppable' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDropOnCell(e, cell.box)}
            >
              <div className="cell-top">
                <strong>{cell.box}</strong>
                <span>Grupo {meta.group}</span>
              </div>
              <p className="cell-title">{cell.row} / {cell.col}</p>
              <div className="cell-list">
                {cellPeople.length > 0 ? (
                  cellPeople.map(person => (
                    <PersonCard
                      key={person.empleado_id}
                      person={person}
                      isSelected={selectedPersonId === person.empleado_id}
                      onSelect={() => onSelectPerson(person.empleado_id)}
                      canEdit={canEdit}
                      onDragStart={(e) => onDragStart(e, person, 'grid')}
                      tone={meta.tone}
                    />
                  ))
                ) : (
                  <div className="empty">Sin personas para los filtros actuales.</div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}