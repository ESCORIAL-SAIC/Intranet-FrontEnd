import PilarEditor from './PilarEditor';
import { sumaPesos, pesosPilaresValidos } from '../utils';
import { PILAR_VACIO } from '../constants';

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

    return (
        <div className="oa-pilares-form">
            {pilares.map((pilar, index) => (
                <PilarEditor
                    key={index}
                    pilar={pilar}
                    index={index}
                    onChange={actualizarPilar}
                    onEliminar={pilares.length > 1 ? eliminarPilar : null}
                />
            ))}

            <button type="button" className="oa-boton-secundario" onClick={agregarPilar}>
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
