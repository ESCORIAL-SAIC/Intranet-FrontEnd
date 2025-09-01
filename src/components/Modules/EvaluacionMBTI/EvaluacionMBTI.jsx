import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EvaluacionMBTI.css';

function EvaluacionMBTI(){

    let navigate = useNavigate()
    const iframeRef = useRef(null);
    //const [usuario, setUsuario] = useState('')
    const [evaluacion, setEvaluacion] = useState('')

    const getEvaluacion = async (usuario, nombre) => {
        try {
            const token = localStorage.getItem('token');


            const response = await fetch(`https://mbti.escorial.com.ar/api/get-test?name=${usuario}`,{
            headers: {
                Authorization: token,
            }
            })
            const jsonData = await response.json();
            
            
            if (response.ok) {
                if(jsonData.data.results_page != null){
                    setEvaluacion(jsonData.data.translated_results_page)
                }else{
                    setEvaluacion(jsonData.data.translated_test_url);
                }
            } else {
                getCreateEval(usuario, nombre);
            }

        } catch (err) {
            console.log(err.message)
        }
    }

    const getCreateEval = async (usuario, nombre) =>{
        const token = localStorage.getItem('token');
        const response = await fetch('https://mbti.escorial.com.ar/api/create-test',
            {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: usuario, fullName: nombre })
            }
        );
        const jsonData = await response.json();
        setEvaluacion(jsonData.translated_test_url); 
        
    } 

    const getUsuario = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "/usuario", {
                headers: {
                    Authorization: token,
                }
            });

            const username = res.data.usuario
            const nombre = res.data.nombre
            
            getEvaluacion(username, nombre); 
        } catch (err) {
            console.log(err.message);
        }
    };

    const iniciaCarga = () => {
        document.getElementById("pantalla-carga").style.visibility = "visible"
    }

    const terminaCarga = () => {
        document.getElementById("pantalla-carga").style.visibility = "hidden"
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })
        iniciaCarga()
        getUsuario()

        if (iframeRef.current) {
            iframeRef.current.addEventListener('load', () => {
                terminaCarga();
            });
        }        
    }, []);

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">edit_note</i>
                <p className="seccion-titulo">EVALUACION MBTI</p>
            </div>
            <div className="">
                <div className='pantalla-carga' id='pantalla-carga'>
                    <div className='loader'></div>
                </div>
                <iframe className="frame" id="frame-mbti" src={evaluacion} ref={iframeRef}/>
            </div>
        </div>
    );
}

export default EvaluacionMBTI;