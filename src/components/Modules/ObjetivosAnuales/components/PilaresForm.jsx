import PilarEditor from './PilarEditor';
import { sumaPesos, pesosPilaresValidos, cantidadPilaresValida } from '../utils';
import { PILAR_VACIO, PILARES_MIN, PILARES_MAX } from '../constants';

// Editor de la lista completa de pilares de un registro (alta o edición mientras está en borrador).
function PilaresForm({ pilares, onChange }) {

    const actualizarPilar = (index, pilarActualizado) => {
        const copia = [...pilares];
        copia[index] = pilarActualizado;
        onChange(copia);
    };

    const agregarPilar = () => {
        onChange([...pilares, { ...PILAR_VACIO }]);
    };

    const eliminarPilar = (index) => {
        onChange(pilares.filter((_, i) => i !== index));
    };

    const suma = sumaPesos(pilares);
    const valido = pesosPilaresValidos(pilares);
    const cantidadValida = cantidadPilaresValida(pilares);

    return (
        <div className="oa-pilares-form">
            {!cantidadValida && (
                <div className="oa-alert-box">
                    Un registro debe tener entre {PILARES_MIN} y {PILARES_MAX} pilares (actual: {pilares.length}).
                </div>
            )}

            {pilares.map((pilar, index) => (
                <PilarEditor
                    key={index}
                    pilar={pilar}
                    index={index}
                    onChange={actualizarPilar}
                    onEliminar={pilares.length > 1 ? eliminarPilar : null}
                />
            ))}

            <button type="button" className="oa-boton-secundario" onClick={agregarPilar} disabled={pilares.length >= PILARES_MAX}>
                <i className="material-symbols-outlined">add</i> Agregar pilar
            </button>

            <div className={`oa-suma-pesos ${valido ? 'valido' : 'invalido'}`}>
                <span className="oa-suma-pesos-num">{suma}%</span>
                <span>{valido ? 'La suma de los pesos es correcta (100%)' : `La suma de los pesos debe ser 100% (actual: ${suma}%)`}</span>
            </div>
        </div>
    );
}

export default PilaresForm;
