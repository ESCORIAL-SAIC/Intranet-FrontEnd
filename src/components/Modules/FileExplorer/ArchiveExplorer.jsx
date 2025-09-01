import { json } from 'react-router-dom';
import Folder from './Folder.jsx';
import SearchBar from './SearchBar.jsx';
import './ArchiveExplorer.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Frame from "../../Varios/Frame";

function ArchiveExplorer(){

    let navigate = useNavigate()

    const [archives, setArchives] = useState();  
    const [link, setLink] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })

        getArchives('');
      }, []);    

      const confirmarBusqueda = (busqueda) => {
        getArchives(busqueda)
      }

      const getArchives = async (busq) => {
        try {
            let apiCon = ''
            
            if (busq == ''){
              apiCon = process.env.REACT_APP_BASE_URL+"/getdir?dir=D:/RECURSOS/SGC Escorial"
            }else{
              apiCon = process.env.REACT_APP_BASE_URL+"/searchdir?dir=D:/RECURSOS/SGC Escorial&search=" + busq 
            }
            const response = await fetch(apiCon);
            const jsonData = await response.json();

            setArchives(jsonData)

          } catch (err) {
            console.log(err.message)
          }  
    }

    const openFile = (filePath) => {
      setLink('http://intranet.escorialsa.com.ar:4444'+filePath.replace("D:\\RECURSOS\\SGC Escorial\\", "\\SGC\\"))
    }

    return(
            <div className='container'>
              <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">home_storage</i>
                <p className="seccion-titulo">GESTOR DE CONOCIMIENTOS</p>
              </div>
              <SearchBar buscar={confirmarBusqueda}/>
              <div className="file-container">
                <div className='explorer'>
                  <Folder explorer={archives} oFile={openFile}/>
                </div>
                <div className="pdf-visualizer" id="pdf-visualizer">
                  <iframe src={link} className='frame'></iframe>
                  {/* <Frame value={link}/> */}
                </div>
              </div>
            </div>
    );
}

export default ArchiveExplorer;