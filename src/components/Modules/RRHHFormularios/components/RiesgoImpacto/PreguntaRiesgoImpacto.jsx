// Fila de pregunta con opciones tipo "pill" — layout basado en el maquetado de referencia
// (info-prompts/RRHHFormularios/Formulario Riesgo-Impacto de Pérdida.html), sin la sección "Análisis de la IA".
function PreguntaRiesgoImpacto({ numero, pregunta, valor, onChange, soloLectura }) {
    if (soloLectura) {
        const opcionElegida = pregunta.opciones.find(o => o.id === valor);
        return (
            <div className="rf-q-row">
                <div>
                    <div className="rf-q-num">{numero}</div>
                    <div className="rf-q-text">{pregunta.texto}</div>
                    {pregunta.nota && <div className="rf-q-note">{pregunta.nota}</div>}
                </div>
                <div className={`rf-q-respuesta-valor tier-${opcionElegida ? opcionElegida.tier : 'vacio'}`}>
                    {opcionElegida ? opcionElegida.label : 'Sin responder'}
                </div>
            </div>
        );
    }

    return (
        <div className="rf-q-row">
            <div>
                <div className="rf-q-num">{numero}</div>
                <div className="rf-q-text">{pregunta.texto}</div>
                {pregunta.nota && <div className="rf-q-note">{pregunta.nota}</div>}
            </div>
            <div className="rf-q-options">
                {pregunta.opciones.map(o => (
                    <label key={o.id} className={`rf-q-opt-label tier-${o.tier} ${valor === o.id ? 'checked' : ''}`}>
                        <input
                            type="radio"
                            className="rf-q-opt"
                            name={pregunta.codigo}
                            checked={valor === o.id}
                            onChange={() => onChange(pregunta.codigo, o.id)}
                        />
                        <span className="dot"></span>{o.label}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default PreguntaRiesgoImpacto;
