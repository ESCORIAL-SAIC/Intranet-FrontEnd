import { useNavigate } from "react-router-dom";
import Frame from "../../Varios/Frame";
import { useEffect } from "react";
import axios from "axios";

function CircuitoCompras(){

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
            <i className="material-symbols-outlined seccion-icon">card_travel</i>
            <p className="seccion-titulo">CIRCUITO COMPRAS</p>
        </div>
        <div className="circuito-compras">
            <Frame value={'https://app.powerbi.com/view?r=eyJrIjoiMDkzNzNkMDMtZTZlNy00MmY1LTkxYzgtMjc1MWYwZGYwNjI1IiwidCI6Ijg0Yzk5M2QxLWRiMDEtNGUzYy1iMzcxLThlZjJmNDNhZmZhZSIsImMiOjR9'}/>
        </div>
    </div>
    );
}

export default CircuitoCompras;