import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { OrgChartComponent } from './OrgChart';
import * as d3 from 'd3';
import './Organigrama.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrganigramaAdm = (props) => {

  let navigate = useNavigate()

  const [data, setData] = useState(null);
  const [fecha, setFecha] = useState('')
  let addNodeChildFunc = null;

  
  useEffect(() => {

    const token = localStorage.getItem('token');
    axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        headers: {
            Authorization: token,
            GrupoUsuario: "'rol_intranet_adm'"
        }
    }).then(res => {
      // El CSV no esta en git: en produccion lo sirve nginx desde el servidor,
      // en desarrollo va en public/organigrama/
      d3.csv(
        process.env.PUBLIC_URL + '/organigrama/organigramaAdm.csv'
      ).then((data) => {
        setData(data);
        setFecha(data[0].actualizado);
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

export default OrganigramaAdm;
