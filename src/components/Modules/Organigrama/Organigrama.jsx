import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { OrgChartComponent } from './OrgChart';
import * as d3 from 'd3';
import csv from './organigrama.csv';
import './Organigrama.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Organigrama = (props) => {

  let navigate = useNavigate()

  const [data, setData] = useState(null);
  const [fecha, setFecha] = useState('')
  let addNodeChildFunc = null;

  useEffect(() => {

    const token = localStorage.getItem('token');
    axios.get(process.env.REACT_APP_BASE_URL+"/main", {
        headers: {
            Authorization: token,
        }
    }).then(res => {}).catch(err => {
        navigate('/login')
    })

    d3.csv(
      csv
    ).then((data) => {
      setData(data);
      setFecha(data[0].actualizado)
    });
  }, [true]);
  return (
    <div className="container">
      <div className="seccion">
        <i className="material-symbols-outlined seccion-icon">account_tree</i>
        <p className="seccion-titulo">ORGANIGRAMA</p>
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

export default Organigrama;