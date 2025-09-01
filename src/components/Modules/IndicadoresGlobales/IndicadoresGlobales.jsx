import { useNavigate } from "react-router-dom";
import Frame from "../../Varios/Frame";
import { useEffect } from "react";
import axios from "axios";

function IndicadoresGlobales(){

    let navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })
      }, []);    

    return(
    <div className="container">
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">dashboard</i>
            <p className="seccion-titulo">INDICADORES GLOBALES</p>
        </div>
        <div className="indicadores-globales">
            <Frame value={'https://app.powerbi.com/view?r=eyJrIjoiZDEyMDQ2OWEtY2IzNS00ZTIwLTkxNDAtNjQ2OGZlNTJkMmY3IiwidCI6Ijg0Yzk5M2QxLWRiMDEtNGUzYy1iMzcxLThlZjJmNDNhZmZhZSIsImMiOjR9'}/>
        </div>
    </div>
    );
}

export default IndicadoresGlobales;