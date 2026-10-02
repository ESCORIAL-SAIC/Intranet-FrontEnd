function ProgresoInduccion({ progreso, estado }) {
    const finalizada = estado === 'finalizado' || progreso.porcentaje === 100;
    return (
        <section className="ri-card ri-progreso">
            <div className="ri-progreso-top">
                <div>
                    <div className="ri-progreso-label">Estado de la inducción</div>
                    <div className={`ri-progreso-estado ${finalizada ? 'finalizada' : ''}`}>
                        {estado === 'borrador' ? 'Borrador' : finalizada ? 'Finalizada' : 'En curso'}
                    </div>
                </div>
                <div className="ri-progreso-porcentaje">{progreso.porcentaje}%</div>
            </div>
            <div className="ri-progreso-barra">
                <div className="ri-progreso-relleno" style={{ width: `${progreso.porcentaje}%` }}></div>
            </div>
            <div className="ri-progreso-detalle">
                {progreso.completadas} de {progreso.total} actividades completadas
            </div>
        </section>
    );
}

export default ProgresoInduccion;
