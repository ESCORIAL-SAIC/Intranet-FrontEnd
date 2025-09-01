import { json } from 'react-router-dom';
import user from '../../../img/user.png';
import { useEffect, useState } from 'react';

function UsuarioDetalle(props){
  
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
        <div className='user-container'>
            <div>
                <img className='user-img' src={
                    image != null
                    ? image
                    : user
                    } alt="" />
            </div>
            <div className='user-text-container'>
                <p className='user-bievenida'>BIENVENIDO</p>
                <p className='user-nombre'>{usuario}</p>
                <p className='user-puesto'>{puesto}</p>
            </div>
        </div>
    );
}

export default UsuarioDetalle;