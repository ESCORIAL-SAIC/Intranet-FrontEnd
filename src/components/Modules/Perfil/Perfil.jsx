import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListadoTareas from "./ListadoTareas";
import ListadoInsumos from "./ListadoInsumos";
import MainMenuBar from "../Main/MainMenuBar";
import UsuarioDetalle from "./UsuarioDetalle";
import banner from '../../../img/banner2.jpg';
import './Perfil.css';
import ListadoIndicadores from "./ListadoIndicadores";
import ListadoEstudios from "./ListadoEstudios";

function Perfil(){
    let navigate = useNavigate();
    const [verIndicadores, setVerIndicadores] = useState(false) 

    const permiteIndicadores = async () => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        headers: {
            Authorization: token,
            GrupoUsuario: "'administradores','Direccion'"
        }
        }).then(res => {
            setVerIndicadores(true)
        }).catch(err => {
            setVerIndicadores(false)
        })
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            //console.log(res)
        }).catch(err => {
            navigate('/login')
        })
        permiteIndicadores();
    }, [])

    return(
        <div className="perfil">
            <div className="top-image-container">
                <img src={banner} className="top-image" />
            </div>
            <div className="perfil-container">
                <div className="perfil-container-left">
                    <UsuarioDetalle/>
                    <p className="titulo-accesos">Accesos</p>
                    <MainMenuBar/>
                    <ListadoInsumos/>
                </div>
                <div className="perfil-container-right">
                    <ListadoTareas/>
                    {
                        verIndicadores
                        ? <ListadoIndicadores/>
                        : <></>
                    }
                    <ListadoEstudios/>
                </div>
            </div>
        </div>
    );
}

export default Perfil;