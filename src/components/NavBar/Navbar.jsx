import './Navbar.css';
import logo from '../../img/logo.png';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

function NavBar() {

  const [usuario, setUsuario] = useState(''); 
  const [image, setImage] = useState('');
  const [token, setToken] = useState(null);

  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  const getUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(process.env.REACT_APP_BASE_URL+"/bienvenido",{
      headers: {
          Authorization: token,
      }
      })
      const jsonData = await response.json();
      setToken(localStorage.getItem('token'))
      setUsuario(jsonData[0].usuario)
      setImage('data:image/png;base64, ' + jsonData[0].image)
    } catch (err) {
        console.log(err.message)
    }
  };
  
  useEffect(() => {
      getUsuario();
  }, [localStorage.getItem('token')]);


  return (
    <div className="header">
            <a href="/"><img src={logo} className="img-logo"></img></a>            
              {
                token != null
                ? 
                <div className='nav-usuario-cont'>
                  <a href="/perfil" className='nav-usuario'>
                    <img className='img-usuario' src={image} alt="" />
                    <p className='nav-usuario'>{usuario}</p>
                  </a>
                  <button onClick={logout} className='button-logout'>SALIR</button>
                </div>
                : null
              }
    </div>
  );
}   

export default NavBar;