import { useEffect, useState } from "react";
import Estudio from "./Estudio";

function RegistroEstudios(){

    const [clasificadores, setClasificadores] = useState([])

    const ocultarVisualizador = () => {
        document.getElementById('visualizador-carga-estudios').style.display = 'none'
    }

    const agregarEstudio = () => {
        setClasificadores(v => [...v, clasificadores[0]])
    }

    const eliminarEstudio = id => {
        if(clasificadores.length > 1){
            const array = clasificadores.splice(1)
            setClasificadores(array)
        }
    }

    const enviarEstudios = async () => {
        let result = []
        try {
            let estudios = document.getElementsByClassName("estudio")
            const error = document.getElementById('error-estudios')
            let regexp = /^[A-Za-z0-9ñÑ\s]*$/
            for(let estudio of estudios){
                if(estudio.children[1].value == ''){
                    error.innerText = 'Faltan completar el detalle de los estudios cargados'
                    return false
                }
            
                if(!regexp.test(estudio.children[1].value)){
                    error.innerText = 'No se permiten caracteres especiales'
                    return false
                }

                result.push({
                    "tipoEstudioId": estudio.children[0].value,
                    "estudio": estudio.children[1].value,
                    "progresoId": estudio.children[2].value
                })
            }
            error.innerText = ''
            const token = localStorage.getItem('token');
            await fetch(process.env.REACT_APP_BASE_URL+'/enviar-estudios',
            {
                method: 'POST',
                headers: { 
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            }
            );
            document.getElementById("visualizador-carga-estudios-c").classList.remove('show')
            document.getElementById("visualizador-carga-estudios-c").classList.add('hide')
            document.getElementById("visualizador-carga-estudios-finalizada").classList.remove('hide')
            document.getElementById("visualizador-carga-estudios-finalizada").classList.add('show')
        } catch (err) {
            console.log(err)
        }
    }


    const getClasificadores = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.REACT_APP_BASE_URL+"/estudios-clasificadores",{
            headers: {
                Authorization: token,
            }
        })
        const jsonData = await response.json();
        setClasificadores(jsonData);
    }


    useEffect(() => {
        getClasificadores();
    }, [])

    return(
        <div className="visualizador-carga-estudios" id="visualizador-carga-estudios">
            <div id="backgroud-visualizador" className='backgroud-visualizador' onClick={ocultarVisualizador}></div>
            <div className="visualizador-carga-estudios-contenido">
                <p className="titulo-carga-estudios">REGISTRO DE ESTUDIOS</p>
                <div className="visualizador-carga-estudios-c show" id='visualizador-carga-estudios-c'>
                    <p className="error-estudios" id="error-estudios"></p>
                    <div className="visualizador-estudios-titulos">
                        <p className="titulo-tipo-estudio">TIPO DE ESTUDIO</p>
                        <p className="titulo-estudio">ESTUDIO</p>
                        <p className="titulo-progreso-estudio">PROGRESO</p>
                    </div>
                    <div className="listado-estudios" id="listado-estudios">
                    {
                        clasificadores.map((cl, index) => (
                            <Estudio value={cl} id={index} eliminarEstudio={eliminarEstudio}/>
                        ))
                    } 
                    </div>
                    <div className="estudio-botones">
                        <a className="estudio-icono-container" href="#"><i className='material-symbols-outlined estudios-icono' onClick={agregarEstudio}>add</i></a>
                        <a className="estudio-icono-container" href="#"><i className='material-symbols-outlined estudios-icono' onClick={eliminarEstudio}>remove</i></a>
                    </div>
                    <a className='estudio-boton-confirmar' href="#" onClick={enviarEstudios}>CONFIRMAR</a>
                </div>
                <div className="visualizador-carga-estudios-finalizada hide" id='visualizador-carga-estudios-finalizada'>
                    <p className="carga-estudios-finalizada-texto">Estudios Registrados!</p>
                </div>
            </div>
        </div>
    );
}

export default RegistroEstudios;