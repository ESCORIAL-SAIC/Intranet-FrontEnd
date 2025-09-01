import user from '../../../img/user.png';
import { useEffect, useState } from 'react';
import './UsuarioDetalle.css'

function UsuarioDetalle(){

    const [usuario, setUsuario] = useState(''); 
    const [puesto, setPuesto] = useState('');
    const [image, setImage] = useState('');

    const getUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.REACT_APP_BASE_URL+"/bienvenido",{
        headers: {
            Authorization: token,
        }
        })
        const jsonData = await response.json();
        setUsuario(jsonData[0].nombre)
        setPuesto(jsonData[0].puesto)
        setImage('data:image/png;base64, ' + jsonData[0].image)
      } catch (err) {
        console.log(err.message)
      }
    };
  
    useEffect(() => {
        getUsuario();
    }, []);
  

    return(
        <div className="usuario-detalle">
            <img src={
                    image != null
                    ? image
                    : user
                    } className="usuario-img" />
            <p className="usuario-nombre">{usuario}</p>
            <p className="usuario-puesto">{puesto}</p>
        </div>
    );
}

export default UsuarioDetalle;