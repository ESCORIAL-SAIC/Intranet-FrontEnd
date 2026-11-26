import './Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import logo from '../../img/logo.png';

const REGEX_CARACTERES = new RegExp("^[a-zA-Z0-9_-ñ-Ñ]*$");

function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsuario, setErrorUsuario] = useState('');
    const [errorContra, setErrorContra] = useState('');
    const [errorCredenciales, setErrorCredenciales] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            navigate('/')
        }).catch(err => {
            navigate('/login')
        })

    }, [])

    const validarCampo = (valor, nombre) => {
        if (valor.length < 3 || valor.length > 20) {
            return `${nombre} debe tener entre 3 a 20 caracteres`;
        }
        if (!REGEX_CARACTERES.test(valor)) {
            return "No se permiten caracteres especiales";
        }
        return '';
    }

    const validarCredenciales = () => {
        const errUsuario = validarCampo(username.trim(), "El usuario");
        const errContra = validarCampo(password, "La contraseña");
        setErrorUsuario(errUsuario);
        setErrorContra(errContra);
        return !errUsuario && !errContra;
    }

    const submit = (event) => {
        event.preventDefault();
        if (cargando) return;
        setErrorCredenciales('');

        if (!validarCredenciales()) return;

        setCargando(true);
        axios.post(process.env.REACT_APP_BASE_URL+"/login", { username: username.trim(), password })
            .then(user => {
                localStorage.setItem('token', user.data.token)
                navigate('/')
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    setErrorCredenciales("Usuario o contraseña incorrectos");
                    setPassword('');
                } else if (err.response) {
                    setErrorCredenciales("Ocurrió un error al iniciar sesión. Intentá nuevamente más tarde.");
                } else {
                    setErrorCredenciales("No se pudo conectar con el servidor. Verificá tu conexión.");
                }
            })
            .finally(() => setCargando(false));
    }

    return (
        <div className="primary-container">
                <div className="login-container">
                    <form className='input-login-container' onSubmit={submit} noValidate>
                        <img className='img-logo-login' src={logo} alt="" />
                        {errorCredenciales && (
                            <div className="alerta-credenciales" role="alert">{errorCredenciales}</div>
                        )}
                        <input
                            type="text"
                            name="username"
                            placeholder="Usuario"
                            id="username"
                            autoComplete="username"
                            autoFocus
                            className={`input-login-usuario${errorUsuario || errorCredenciales ? ' input-error' : ''}`}
                            value={username}
                            onChange={event => {
                                setUsername(event.target.value);
                                setErrorUsuario('');
                                setErrorCredenciales('');
                            }}
                        />
                        <p className="error-usuario">{errorUsuario}</p>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            id="password"
                            autoComplete="current-password"
                            className={`input-login-contra${errorContra || errorCredenciales ? ' input-error' : ''}`}
                            value={password}
                            onChange={event => {
                                setPassword(event.target.value);
                                setErrorContra('');
                                setErrorCredenciales('');
                            }}
                        />
                        <p className="error-contra">{errorContra}</p>
                        <button type="submit" className='login-button' disabled={cargando}>
                            {cargando ? 'INGRESANDO...' : 'ACCEDER'}
                        </button>
                    </form>
                    <div className='logo-container'><img className='img-logo-h' src={logo} alt="" /><h1 className="login-text">BIENVENIDO A LA INTRANET ESCORIAL 2.0</h1></div>
                </div>
            </div>
    );
}

export default Login;
