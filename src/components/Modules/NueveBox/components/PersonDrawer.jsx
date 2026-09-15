import { BOX_META } from '../constants';
import { getCaja, fmt } from '../utils';

export default function PersonDrawer({ selected, canEdit, evaluaciones, onComentarioChange, onComentarioSave }) {
  if (!selected) {
    return (
      <>
        <h2>Selecciona una persona</h2>
        <p className="drawer-sub">
          Las personas de la grilla se cargan desde la base de datos. Al hacer clic verás el
          detalle completo aquí.
        </p>
        <div className="empty">No hay una persona seleccionada aún.</div>
      </>
    );
  }

  const caja = getCaja(selected);

  return (
    <>
      <h2>{selected.empleado_nombre}</h2>
      <p className="drawer-sub">
        {selected.puesto} | {selected.area} | {BOX_META[caja]?.title} | Grupo {BOX_META[caja]?.group}
      </p>
      <div className="detail-grid">
        <div className="detail">
          <div className="k">Área</div>
          <div className="v">{selected.area}</div>
        </div>
        <div className="detail">
          <div className="k">Manager</div>
          <div className="v">{selected.manager || 'N/A'}</div>
        </div>
        <div className="detail">
          <div className="k">Antigüedad</div>
          <div className="v">{fmt(selected.tenure_years)} años</div>
        </div>
        <div className="detail">
          <div className="k">Riesgo</div>
          <div className="v">{selected.riesgo}</div>
        </div>
      </div>
      <div className="section">
        <h3>Indicadores</h3>
        <div className="score-lines">
          {[
            ['Competencias', selected.competencias_score],
            ['Objetivos', selected.objetivos_score],
            ['Desempeño', selected.performance_score],
            ['FIT score', selected.fit_score],
            ['Potencial líder', `${selected.leader_potential} / 3`],
            ['Potencial', selected.potential_score],
            ['Compromiso', selected.commitment_score],
          ].map(([label, value]) => (
            <div key={label} className="score-line">
              <strong>{label}</strong>
              <span>{typeof value === 'string' ? value : fmt(value)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <h3>Nota de calibración</h3>
        <textarea
          value={selected.comentario || ''}
          readOnly={!canEdit}
          onChange={(e) => canEdit && onComentarioChange(selected.empleado_id, e.target.value)}
          onBlur={() => canEdit && onComentarioSave(selected)}
          style={{
            width: '94%',
            minHeight: '100px',
            padding: '12px',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            fontFamily: 'inherit',
            fontSize: '13px',
            lineHeight: '1.55',
            resize: canEdit ? 'vertical' : 'none',
            background: canEdit ? '' : 'var(--gray-soft)',
            color: canEdit ? '' : '#67625a'
          }}
          placeholder={canEdit ? 'Agregar comentarios o notas de calibración...' : ''}
        />
      </div>
    </>
  );
}