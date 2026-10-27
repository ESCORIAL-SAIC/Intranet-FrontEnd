const estadoColor = (estado) => ({
  background:
    estado === 'borrador' ? 'var(--green-soft)' :
    estado === 'calibrado' ? 'var(--blue-soft)' :
    'var(--gray-soft)',
  color:
    estado === 'borrador' ? '#0f6f54' :
    estado === 'calibrado' ? '#0d4e89' :
    '#34322f'
});

export default function RegistroList({ titulo, registros, loading, onSeleccionar, soloLectura, emptyMsg }) {
  return (
    <section className="panel" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>{titulo}</h3>
        {soloLectura && (
          <span style={{
            fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
            background: 'var(--blue-soft)', color: '#0d4e89', fontWeight: 600
          }}>
            Solo lectura
          </span>
        )}
      </div>
      {loading ? (
        <p>Cargando registros...</p>
      ) : registros.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {registros.map(registro => (
            <div
              key={registro.id}
              className="panel"
              style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease', border: '2px solid transparent' }}
              onClick={() => onSeleccionar(registro.id)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#185fa5')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <h4 style={{ margin: '0 0 8px 0' }}>{registro.nombre}</h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#67625a' }}>
                Año: {registro.anio}
              </p>
              {soloLectura && registro.creado_por && (
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#67625a' }}>
                  Creado por: <strong>{registro.creado_por}</strong>
                </p>
              )}
              <p style={{ margin: '0', fontSize: '11px' }}>
                Estado:{' '}
                <span style={{ padding: '2px 6px', borderRadius: '999px', ...estadoColor(registro.estado) }}>
                  {registro.estado.charAt(0).toUpperCase() + registro.estado.slice(1)}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : emptyMsg ? (
        <p>{emptyMsg}</p>
      ) : null}
    </section>
  );
}