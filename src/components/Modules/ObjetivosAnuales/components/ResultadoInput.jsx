import { useState, useEffect } from 'react';
import { calcularPuntajePilarObjetivo } from '../utils';
import { scoreClass } from '../constants';

// Input del resultado real de un pilar + "score-pill" con el puntaje calculado en vivo.
// El puntaje que se ve mientras se tipea es sólo una previsualización (calcularPuntajePilarObjetivo,
// misma lógica que el backend) — el valor autoritativo es el que devuelve el servidor al guardar.
function ResultadoInput({ pilar, soloLectura, onGuardar, guardando }) {
    const [valor, setValor] = useState(pilar.resultado_real ?? '');

    useEffect(() => {
        setValor(pilar.resultado_real ?? '');
    }, [pilar.resultado_real]);

    if (soloLectura) {
        const puntaje = pilar.puntaje;
        return (
            <div className="oa-resultado-cell">
                <span className="oa-resultado-valor">{pilar.resultado_real ?? '—'}{pilar.unidad ? ` ${pilar.unidad}` : ''}</span>
                <div className={`oa-score-pill ${scoreClass(puntaje)}`}>{puntaje ?? '—'}</div>
            </div>
        );
    }

    const puntajeEnVivo = calcularPuntajePilarObjetivo(pilar, valor);

    return (
        <div className="oa-resultado-cell">
            <input
                className="oa-resultado-input"
                type="text"
                value={valor}
                placeholder="Ingresar resultado..."
                disabled={guardando}
                onChange={(e) => setValor(e.target.value)}
                onBlur={() => {
                    if (valor !== (pilar.resultado_real ?? '')) onGuardar(valor);
                }}
            />
            <div className={`oa-score-pill ${scoreClass(puntajeEnVivo)}`}>{puntajeEnVivo ?? '—'}</div>
        </div>
    );
}

export default ResultadoInput;
