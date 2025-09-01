import Cumple from './Cumple';
import './ListadoCumpleanios.css';
import { useEffect, useState } from 'react';

function ListadoCumpleanios() {

  const [cumpleanios, setCumpleanios] = useState([]);  

  const getCumpleanios = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BASE_URL+"/cumple")
      const jsonData = await response.json();
      setCumpleanios(jsonData);

    } catch (err) {
      console.log(err.message)
    }
  };

  useEffect(() => {
    getCumpleanios();
  }, []);

  return (
    <div className='cum-container'>
        <div className='cum-header'>CUMPLEAÑOS</div>
        <div className='cum-content'>
        {cumpleanios.map(cumple => (
            <Cumple value={cumple}/>
        ))}
        </div>
    </div>
  );
}   

export default ListadoCumpleanios;