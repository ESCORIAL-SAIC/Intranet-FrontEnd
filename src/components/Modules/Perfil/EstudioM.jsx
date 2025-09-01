import { useEffect, useState } from "react";

function EstudioM({respuesta, clEstudios, clProgresos, eliminarEstudio}){

    const [nuevo, setEstado] = useState(false)
    const [idEstudio, setId] = useState('')

    const eliEstudio = () => {
        eliminarEstudio(idEstudio)
    }

    useEffect(() => {
        if(respuesta.id < 0){
            setEstado(true)
        }
        setId(respuesta.id)
    })

    return(
        <div className="estudio-mod" id={respuesta.id}>
            <select className="estudio-desplegable-tipo estudio-input" disabled={!nuevo} defaultValue={respuesta.respuestaTipo}>
                {
                    clEstudios.map(estudio => (
                        <option value={estudio.id}>{estudio.nombre}</option>
                    ))
                }
            </select>
            <input type="text" className="estudio-completable estudio-input" disabled={!nuevo} placeholder={respuesta.respuestaEstudio}/>
            <select className="estudio-desplegable-progreso estudio-input" disabdisabled={!nuevo}led defaultValue={respuesta.respuestaProgreso}>
                {
                    clProgresos.map(progreso => (
                        <option value={progreso.id}>{progreso.nombre}</option>
                    ))
                }
            </select>
            <button className="estudio-icono-container"><i className='material-symbols-outlined estudios-icono' onClick={eliEstudio}>remove</i></button>
        </div>
    )
}

export default EstudioM;