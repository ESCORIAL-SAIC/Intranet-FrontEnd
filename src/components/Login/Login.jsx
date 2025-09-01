import './Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import logo from '../../img/logo.png';



function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errorContra = document.getElementById('error-contra')
    const errorUsuario = document.getElementById('error-usuario')
    const errorCredenciales = document.getElementById('error-credenciales')
    const usuario = document.getElementById('username')
    const contra = document.getElementById('password')

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            //console.log(res)
            navigate('/')
        }).catch(err => {
            //console.log(err);
            navigate('/login')
        })

    }, [])

    const submit = () => {
        if (validarCredenciales()){
            axios.post(process.env.REACT_APP_BASE_URL+"/login", {username, password, 
            headers: {
                "access-control-allow-origin": "*"
            }
            }).then(user => {
                localStorage.setItem('token', user.data.token)
                navigate('/')
            }).catch(err => {
                //errorCredenciales.innerText = err.response.data.message
                console.log(JSON.parse(JSON.stringify(err)))
            })
        }
    }

    const validarCredenciales = () => {
        let regexp = new RegExp("^[a-zA-Z0-9_-ñ-Ñ]*$")
        let flag = true

        if(usuario.value.length < 3 || usuario.value.length > 20){
            errorUsuario.innerText = "El usuario debe tener entre 3 a 20 caracteres"
            flag = false
        }
        else{
            if(!regexp.test(usuario.value)){
                errorUsuario.innerText = "No se permiten caracteres especiales"
                flag = false
            }
            else{
                errorUsuario.innerText = ""
            }
        }
        if(contra.value.length < 3 || contra.value.length > 20){
            errorContra.innerText = "La contraseña debe tener entre 3 a 20 caracteres"
            flag = false
        }
        else{
            if(!regexp.test(contra.value)){
                errorContra.innerText = "No se permiten caracteres especiales"
                flag = false
            }
            else{
                errorContra.innerText = ""
            }
        }
        
        return flag;
    }

    return (
        <div className="primary-container">
                <div className="login-container">
                    <div className='input-login-container'>
                        <img className='img-logo-login' src={logo} alt="" />
                        <p className="error-credenciales" id="error-credenciales"></p>
                        <input type="text" name="username" placeholder="Usuario" id="username" className="input-login-usuario" value={username} onChange={event => setUsername(event.target.value)}/>
                        <p className="error-usuario" id="error-usuario"></p>
                        <input type="password" name="password" placeholder="Contraseña" id="password" className="input-login-contra" value={password} onChange={event => setPassword(event.target.value)}/>
                        <p className="error-contra" id="error-contra"></p>
                        <button className='login-button' onClick={submit}>ACCEDER</button>
                    </div>
                    <div className='logo-container'><img className='img-logo-h' src={logo} alt="" /><h1 className="login-text">BIENVENIDO A LA INTRANET ESCORIAL 2.0</h1></div>                   
                </div> 
            </div>
    );
}   

export default Login;