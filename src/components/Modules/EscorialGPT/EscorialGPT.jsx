import { useNavigate } from "react-router-dom";
import Frame from "../../Varios/Frame";
import { useState,useEffect } from "react";
import axios from "axios";

function EscorialGPT(props){

    let navigate = useNavigate()

    const [usuarioId, setUsuarioId] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {setUsuarioId(res.data.user.id)}).catch(err => {
            navigate('/login');
        })
      }, []);    

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">psychology</i>
                <p className="seccion-titulo">EscorialGPT</p>
            </div>
            <div className="EscorialGPT">
                <Frame value={'http://192.168.1.109:8501/?id='+usuarioId}/>
            </div>
        </div>
    );
}

export default EscorialGPT;