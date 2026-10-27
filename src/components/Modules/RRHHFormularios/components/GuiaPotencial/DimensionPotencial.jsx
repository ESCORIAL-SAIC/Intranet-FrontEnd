import { RATING_OPCIONES } from '../../constants';
import { fmt } from '../../utils';

// Tarjeta de una dimensión de potencial — layout basado en el maquetado de referencia
// (info-prompts/RRHHFormularios/Guia de Potencial.html).
function DimensionPotencial({ numero, dimension, valor, onChange, soloLectura }) {
    const evidencia = valor?.evidencia || '';
    const rating = valor?.rating || '';

    const setEvidencia = (v) => onChange(dimension.codigo, { evidencia: v, rating });
    const setRating = (v) => onChange(dimension.codigo, { evidencia, rating: v });

    return (
        <div className="rf-dim-card">
            <div className="rf-dim-header">
                <div className="rf-dim-num">{numero}</div>
                <div>
                    <div className="rf-dim-title">{dimension.titulo}</div>
                    <div className="rf-dim-subtitle">{dimension.subtitulo}</div>
                </div>
            </div>
            <div className="rf-dim-body">
                <div className="rf-descriptors">
                    <div className="rf-descriptor descriptor-bajo">
                        <div className="rf-descriptor-level">Bajo</div>
                        <div className="rf-descriptor-text">{dimension.descriptores.bajo}</div>
                    </div>
                    <div className="rf-descriptor descriptor-medio">
                        <div className="rf-descriptor-level">Medio</div>
                        <div className="rf-descriptor-text">{dimension.descriptores.medio}</div>
                    </div>
                    <div className="rf-descriptor descriptor-alto">
                        <div className="rf-descriptor-level">Alto</div>
                        <div className="rf-descriptor-text">{dimension.descriptores.alto}</div>
                    </div>
                </div>

                <div className="rf-questions-block">
                    <div className="rf-questions-label">Preguntas guía para el evaluador</div>
                    <ul className="rf-questions-list">
                        {dimension.preguntas.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </div>

                <div className="rf-eval-row">
                    <div>
                        <label className="rf-evidence-label">Evidencia concreta (situación o comportamiento observado)</label>
                        {soloLectura ? (
                            <div className="rf-field-valor">{fmt(evidencia)}</div>
                        ) : (
                            <textarea className="rf-evidence-input" value={evidencia} onChange={(e) => setEvidencia(e.target.value)} placeholder="Describir una situación específica que respalde la evaluación..." />
                        )}
                    </div>
                    <div className="rf-rating-block">
                        <div className="rf-rating-label">Rating</div>
                        {soloLectura ? (
                            <div className={`rf-rating-valor rating-${rating || 'vacio'}`}>{rating ? RATING_OPCIONES.find(o => o.value === rating)?.label : 'Sin evaluar'}</div>
                        ) : (
                            <div className="rf-rating-options">
                                {RATING_OPCIONES.map(o => (
                                    <label key={o.value} className={`rf-rating-opt-label rating-${o.value} ${rating === o.value ? 'checked' : ''}`}>
                                        <input type="radio" className="rf-rating-opt" name={`rating-${dimension.codigo}`} checked={rating === o.value} onChange={() => setRating(o.value)} />
                                        <span className="dot"></span>{o.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DimensionPotencial;
