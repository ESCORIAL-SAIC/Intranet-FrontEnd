import { BOX_META } from '../constants';

export default function Toolbar({ filters, onFiltersChange, areas, estadoRegistro, onEstadoChange, canEdit }) {
  return (
    <section className="panel toolbar">
      <div className="field">
        <label htmlFor="search">Buscar persona</label>
        <input
          id="search"
          type="search"
          placeholder="Nombre, cargo o área"
          value={filters.q}
          onChange={(e) => onFiltersChange({ ...filters, q: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="area">Área</label>
        <select
          id="area"
          value={filters.area}
          onChange={(e) => onFiltersChange({ ...filters, area: e.target.value })}
        >
          <option value="all">Todas</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="box">Caja</label>
        <select
          id="box"
          value={filters.box}
          onChange={(e) => onFiltersChange({ ...filters, box: e.target.value })}
        >
          <option value="all">Todas</option>
          {Object.keys(BOX_META).map(box => (
            <option key={box} value={box}>
              Caja {box} - {BOX_META[box].title}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="status">Estado</label>
        <select
          id="status"
          value={estadoRegistro}
          onChange={(e) => onEstadoChange(e.target.value)}
          disabled={!canEdit}
        >
          <option value="borrador">Borrador</option>
          <option value="calibrado">Calibrado</option>
          <option value="publicado">Publicado</option>
        </select>
      </div>
      <button className="btn" onClick={() => onFiltersChange({ q: '', area: 'all', box: 'all' })}>
        Limpiar
      </button>
    </section>
  );
}