import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function Empleados(){

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
                <i className="material-symbols-outlined seccion-icon">group</i>
                <p className="seccion-titulo">EMPLEADOS</p>
            </div>
            <div className='listado-empleados'>
                
            </div>
        </div>
    );
}

export default Empleados;