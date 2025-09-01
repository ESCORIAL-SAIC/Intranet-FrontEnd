import './Main.css'
import { useEffect, useState } from 'react';
import MainMenuBar from './MainMenuBar';
import ListadoComunicaciones from './ListadoComunicaciones';
import ListadoCumpleanios from './ListadoCumpleanios';
import ListadoCapacitaciones from './ListadoCapacitaciones';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UsuarioDetalle from './UsuarioDetalle';
import MainCapacitaciones from './MainCapacitaciones';
import ListadoTareas from './ListadoTareas';
import HeroImage from './HeroImage';
import IndicadorPrincipal from './IndicadorPrincipal';
import Visualizador from './Visualizador';
import RegistroEstudios from '../../Varios/RegistroEstudios/RegistroEstudios';
import BotonAccesoRegistroEstudios from '../../Varios/RegistroEstudios/BotonAccesosRegistroEstudios';

function Main(){

    let navigate = useNavigate()
    const [estudiosCargados, setEstudiosCargados] = useState(false)
    const [cambiarHeroImg, setCambiarHeroImg] = useState(false)

    const token = localStorage.getItem('token');

    const obtenerEstudiosCargados = async () => {
        axios.get(process.env.REACT_APP_BASE_URL+'/carga-estudios-pendiente', {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            setEstudiosCargados(true)
        }).catch(err => {
            setEstudiosCargados(false)
        })
    }

    axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        headers: {
            Authorization: token,
            GrupoUsuario: "'Direccion','rol_sistemas','rol_analista_contable_senior'"
        }
    }).then(res => {
        setCambiarHeroImg(true)
    }).catch(err => {
        setCambiarHeroImg(false)
    })

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {
        }).catch(err =>{
            navigate('/login')
        })
        obtenerEstudiosCargados();
    }, [])

    return(   
            <div className='main'>
                <div className='left-container'>
                    <UsuarioDetalle/>
                    <MainMenuBar/>
                    <ListadoCapacitaciones/>
                </div>
                <div className='center-container'>
                    {
                        cambiarHeroImg
                        ? <IndicadorPrincipal/>
                        : <HeroImage/>
                    }
                    
                    <MainCapacitaciones/>
                    <ListadoComunicaciones/>
                </div>
                <div className='right-container'>
                    {
                        !estudiosCargados
                        ?<BotonAccesoRegistroEstudios/>
                        :<></>
                    }
                    <ListadoCumpleanios/>
                    <ListadoTareas/>
                </div>
                <Visualizador/>
                {
                    !estudiosCargados
                    ?<RegistroEstudios/>
                    :<></>
                }
            </div>
    );
}

export default Main;