import { useState } from 'react';

export default function NuevoRegistroForm({ onCrear, loading }) {
  const [data, setData] = useState({ nombre: '', anio: new Date().getFullYear() });

  const handleSubmit = () => {
    if (!data.nombre) {
      alert('El nombre del registro es requerido');
      return;
    }
    onCrear(data.nombre, data.anio);
    setData({ nombre: '', anio: new Date().getFullYear() });
  };

  return (
    <section className="panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <h3>Crear Nuevo Registro 9-Box</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="field">
          <label>Nombre del Registro</label>
          <input
            type="text"
            value={data.nombre}
            onChange={(e) => setData({ ...data, nombre: e.target.value })}
            placeholder="Ej: Evaluación 2026"
          />
        </div>
        <div className="field">
          <label>Año</label>
          <input
            type="number"
            value={data.anio}
            onChange={(e) => setData({ ...data, anio: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <button
        className="btn"
        onClick={handleSubmit}
        style={{ marginTop: '12px' }}
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Registro'}
      </button>
    </section>
  );
}