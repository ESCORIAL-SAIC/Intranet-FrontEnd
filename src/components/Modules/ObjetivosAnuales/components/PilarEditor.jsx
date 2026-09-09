import { DIRECCIONES, PESO_MIN, PESO_MAX, UMBRAL_FIELD_LABELS } from '../constants';
import { pesoPilarValido } from '../utils';

// Fila editable de un pilar dentro de PilaresForm: nombre, descripción, peso, unidad,
// dirección y los 5 umbrales editables (a partir de qué resultado se alcanza cada puntaje 1-5).
function PilarEditor({ pilar, index, onChange, onEliminar }) {

    const handle = (campo) => (e) => {
        onChange(index, { ...pilar, [campo]: e.target.value });
    };

    const pesoInvalido = pilar.peso !== '' && pilar.peso !== undefined && pilar.peso !== null && !pesoPilarValido(pilar.peso);

    return (
        <div className="oa-pilar-editor">
            <div className="oa-pilar-editor-fila">
                <div className="oa-field oa-field-nombre">
                    <label className="oa-field-label">Pilar</label>
                    <input className="oa-field-input" type="text" value={pilar.nombre} onChange={handle('nombre')} placeholder="Ej: Costos" required />
                </div>
                <div className="oa-field oa-field-peso">
                    <label className="oa-field-label">Peso (%)</label>
                    <input
                        className={`oa-field-input ${pesoInvalido ? 'oa-field-input-error' : ''}`}
                        type="number"
                        min={PESO_MIN}
                        max={PESO_MAX}
                        step="0.01"
                        value={pilar.peso}
                        onChange={handle('peso')}
                        placeholder="20"
                        required
                    />
                    {pesoInvalido && <span className="oa-field-error">Debe estar entre {PESO_MIN}% y {PESO_MAX}%</span>}
                </div>
                <div className="oa-field oa-field-unidad">
                    <label className="oa-field-label">Unidad</label>
                    <input className="oa-field-input" type="text" value={pilar.unidad} onChange={handle('unidad')} placeholder="%, pts, M$..." />
                </div>
                <div className="oa-field oa-field-direccion">
                    <label className="oa-field-label">Criterio</label>
                    <select className="oa-field-input" value={pilar.direccion} onChange={handle('direccion')}>
                        {DIRECCIONES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                </div>
                {onEliminar && (
                    <button type="button" className="oa-boton-icono" onClick={() => onEliminar(index)} title="Eliminar pilar">
                        <i className="material-symbols-outlined">delete</i>
                    </button>
                )}
            </div>
            <div className="oa-field oa-field-desc">
                <label className="oa-field-label">Descripción del objetivo</label>
                <textarea className="oa-field-textarea" rows="2" value={pilar.descripcion} onChange={handle('descripcion')} placeholder="Describe el objetivo de este pilar" />
            </div>
            <div className="oa-subtitulo-criterios">Criterios de Evaluación</div>
            <div className="oa-umbrales-grid">
                <div className="oa-field">
                    <label className="oa-field-label">{UMBRAL_FIELD_LABELS.umbral_score1}</label>
                    <input className="oa-field-input" type="number" value={pilar.umbral_score1} onChange={handle('umbral_score1')} required />
                </div>
                <div className="oa-field">
                    <label className="oa-field-label">{UMBRAL_FIELD_LABELS.umbral_score2}</label>
                    <input className="oa-field-input" type="number" value={pilar.umbral_score2} onChange={handle('umbral_score2')} required />
                </div>
                <div className="oa-field">
                    <label className="oa-field-label">{UMBRAL_FIELD_LABELS.umbral_score3}</label>
                    <input className="oa-field-input" type="number" value={pilar.umbral_score3} onChange={handle('umbral_score3')} required />
                </div>
                <div className="oa-field">
                    <label className="oa-field-label">{UMBRAL_FIELD_LABELS.umbral_score4}</label>
                    <input className="oa-field-input" type="number" value={pilar.umbral_score4} onChange={handle('umbral_score4')} required />
                </div>
                <div className="oa-field">
                    <label className="oa-field-label">{UMBRAL_FIELD_LABELS.umbral_score5}</label>
                    <input className="oa-field-input" type="number" value={pilar.umbral_score5} onChange={handle('umbral_score5')} required />
                </div>
            </div>
        </div>
    );
}

export default PilarEditor;
