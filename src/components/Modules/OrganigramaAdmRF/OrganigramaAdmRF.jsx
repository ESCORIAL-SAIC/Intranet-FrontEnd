import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { OrgChartComponent } from './OrgChart';
import * as d3 from 'd3';
import './Organigrama.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrganigramaAdmRF = (props) => {

  let navigate = useNavigate()

  const [data, setData] = useState(null);
  const [fecha, setFecha] = useState('')
  const [gerencia, setGerencia] = useState('')
  let addNodeChildFunc = null;

  useEffect(() => {

    const token = localStorage.getItem('token');
    // Obtener la gerencia del usuario desde localStorage o de una API de usuario
    const userGerencia = localStorage.getItem('userGerencia') || 'RRHH, ADMINISTRACION Y SISTEMAS';
    
    axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        headers: {
            Authorization: token,
            GrupoUsuario: "'Todos'"
        }
    }).then(res => {
      // Consumir la API para obtener el CSV dinámicamente
      //axios.get(`http://localhost:2223/organigrama?gerencia=${userGerencia}`,{headers: {
      axios.get(`http://localhost:2223/organigrama`,{headers: {
            Authorization: token
        }})
        .then(response => {
          // Convertir los datos de la API al formato esperado por OrgChart
          const csvData = response.data;
          setData(csvData);
          setGerencia(userGerencia);
          if (csvData && csvData.length > 0 && csvData[0].actualizado) {
            setFecha(csvData[0].actualizado);
          } else {
            setFecha('-');
          }
        })
        .catch(err => {
          console.error('Error al cargar el organigrama:', err);
          setFecha('-');
        });
    }).catch(err => {
        navigate('/')
    })
  }, [true]);
  return (
    <div className="container">
      <div className="seccion">
        <i className="material-symbols-outlined seccion-icon">mintmark</i>
        <p className="seccion-titulo">ORGANIGRAMA ADM</p>
      </div>
      <div className="Organigrama">
        <p className='fecha-organigrama'>Fecha actualización: {fecha.substring(0,19)}</p>
        <OrgChartComponent
          setClick={(click) => (addNodeChildFunc = click)}
          data={data}
        />
      </div>
    </div>
  );

}

export default OrganigramaAdmRF;