import './CargaComunicaciones.css'
import Frame from "../../Varios/Frame";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';



function CargaComunicaciones(){

    let navigate = useNavigate()

    useEffect(() => {

        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
            headers: {
                Authorization: token,
                GrupoUsuario: "'rrhh','administradores'"
            }
        }).then(res => {
          
        }).catch(err => {
            navigate('/')
        })
      }, [true]);

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">forward_to_inbox</i>
                <p className="seccion-titulo">CARGA COMUNICACIONES</p>
            </div>
            <div className='carga-comunicaciones'>
                <Frame value={'http://192.168.1.116:81/'}/>
            </div>
        </div>
    );
}

export default CargaComunicaciones;