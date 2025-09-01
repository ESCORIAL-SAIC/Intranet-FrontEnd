import { useEffect, useState } from "react";
import EstudioM from "./EstudioM";
import "./ListadoEstudios.css";

function ListadoEstudios(){
    
    const [estudios, setEstudios] = useState([])
    const [resp, setResp] = useState([])
    const [idNeg, setIdNeg] = useState(-1)

    const getEstudios = async () => {
        const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/estudios-cargados",{
                headers: {
                    Authorization: token,
                }
            })
        const jsonData = await response.json();
        setEstudios(jsonData);
        setResp(jsonData[0].respuestas)
    }

    const editar = () => {
        const inputs = document.getElementsByClassName("estudio-input")
        for(let input of inputs){
            input.disabled = false
        }
        document.getElementById('estudio-boton-editar').classList.remove('show')
        document.getElementById('estudio-boton-editar').classList.add('hide')
        document.getElementById('estudio-boton-guardar').classList.remove('hide')
        document.getElementById('estudio-boton-guardar').classList.add('show')
        document.getElementById('estudio-icono-container').classList.remove('hide')
        document.getElementById('estudio-icono-container').classList.add('show')
    }

    const updateEstudios = async () => {

        let result = []
        try {
            let estudios = document.getElementsByClassName("estudio-mod")
            const error = document.getElementById('error-estudios')
            let regexp = /^[A-Za-z0-9ñÑ\s]*$/

            let estudioTexto = ''

            for(let estudio of estudios){
                if(estudio.children[1].value == '' && estudio.children[1].placeholder == undefined){
                    error.innerText = 'Faltan completar el detalle de los estudios cargados'
                    return false
                }else if(estudio.children[1].value == '' && estudio.children[1].placeholder != undefined){
                    estudioTexto = estudio.children[1].placeholder
                }else{
                    estudioTexto = estudio.children[1].value
                }
            
                if(!regexp.test(estudio.children[1].value)){
                    error.innerText = 'No se permiten caracteres especiales'
                    return false
                }

                result.push({
                    "id": estudio.id,
                    "tipoEstudioId": estudio.children[0].value,
                    "estudio": estudioTexto,
                    "progresoId": estudio.children[2].value
                })
            }         
            
            error.innerText = ''
            const token = localStorage.getItem('token');
            await fetch(process.env.REACT_APP_BASE_URL+'/modificar-estudios',
            {
                method: 'POST',
                headers: { 
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            }
        );

        const inputs = document.getElementsByClassName("estudio-input")
        for(let input of inputs){
            input.disabled = true
        }
        document.getElementById('estudio-boton-editar').classList.add('show')
        document.getElementById('estudio-boton-editar').classList.remove('hide')
        document.getElementById('estudio-boton-guardar').classList.add('hide')
        document.getElementById('estudio-boton-guardar').classList.remove('show')
        document.getElementById('estudio-icono-container').classList.remove('show')
        document.getElementById('estudio-icono-container').classList.add('hide')

        window.location.reload()
        }
        catch(err){
            console.log(err)
        }
    }

    const agregarEstudio = () => {
        setResp(v => [...v, {
            "id": idNeg,
            "respuestaTipo": "",
            "respuestaEstudio": "",
            "respuestaProgreso": ""
        }])
        setIdNeg(idNeg -1);
    }

    const borrarEstudio = id => {
        setResp(v => v.filter(item => item.id !== id))
    }

    useEffect(() => {
        getEstudios();
    }, [])

    return(
        <div className="estudiosM">
            <p className="titulo-estudios-cargados">Información Académica</p>
            <div className="listado-estudiosM">
                <div className="visualizador-estudios-titulos">
                        <p className="titulo-tipo-estudio">TIPO DE ESTUDIO</p>
                        <p className="titulo-estudio">ESTUDIO</p>
                        <p className="titulo-progreso-estudio">PROGRESO</p>
                </div>  
                <p className="error-estudios" id="error-estudios"></p>
                <div className="listado-estudios-cm">
                    <div className="listado-estudios-container">
                        {
                            estudios.map(estudio => (
                                resp.map(respuesta => (
                                    <EstudioM respuesta={respuesta} clEstudios={estudio.estudios} clProgresos={estudio.progresos} eliminarEstudio={borrarEstudio}/>
                                ))
                            ))
                        }
                    </div>
                    <div className="estudio-botones">
                        <a className="estudio-icono-container hide" id='estudio-icono-container' onClick={agregarEstudio}><i className='material-symbols-outlined estudios-icono'>add</i></a>
                    </div>
                </div>
                <a className='listado-estudio-boton show' id='estudio-boton-editar' onClick={editar}>EDITAR</a>
                <a className='listado-estudio-boton hide' id='estudio-boton-guardar' onClick={updateEstudios}>GUARDAR</a>
            </div>
        </div>
    )
}

export default ListadoEstudios;