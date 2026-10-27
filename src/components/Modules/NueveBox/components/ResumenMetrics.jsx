export default function ResumenMetrics({ summary }) {
  return (
    <section className="summary">
      <article className="panel metric blue">
        <div className="label">Personas cargadas</div>
        <div className="value">{summary.total}</div>
        <div className="hint">Incluye grilla y bandeja</div>
      </article>
      <article className="panel metric gray">
        <div className="label">Asignadas</div>
        <div className="value">{summary.assigned}</div>
        <div className="hint">Ya ubicadas en la grilla</div>
      </article>
      <article className="panel metric green">
        <div className="label">Pendientes</div>
        <div className="value">{summary.pending}</div>
        <div className="hint">Listas para asignar</div>
      </article>
      <article className="panel metric red">
        <div className="label">Necesita desarrollo</div>
        <div className="value">{summary.c}</div>
        <div className="hint">Cajas 1, 3 y 6</div>
      </article>
    </section>
  );
}