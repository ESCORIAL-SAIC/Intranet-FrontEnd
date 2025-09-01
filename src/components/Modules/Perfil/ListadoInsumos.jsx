import { useEffect, useState } from "react";
import Insumo from "./Insumo";
import './ListadoInsumos.css';

function ListadoInsumos(){

    const [insumos, setInsumos] = useState([])

    const getInsumos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/insumos",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setInsumos(jsonData);
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getInsumos();
    }, [])


    return(
            <div className="listado-insumos">
                <p className="titulo-insumos">Insumos</p>
                <div className="insumos">
                    {insumos.map(ins => (
                        <Insumo value={ins}/>
                    ))}
                </div>
            </div>
    );
}

export default ListadoInsumos;