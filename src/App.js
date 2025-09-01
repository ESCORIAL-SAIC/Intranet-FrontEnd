import './App.css';
import { Route, Routes } from 'react-router-dom';
import ArchiveExplorer from './components/Modules/FileExplorer/ArchiveExplorer'
import Organigrama from './components/Modules/Organigrama/Organigrama';
import MenuBar from "./components/MenuBar/MenuBar";
import NavBar from "./components/NavBar/Navbar";
import Main from './components/Modules/Main/Main';
import Login from './components/Login/Login';
import CircuitoCompras from './components/Modules/CircuitoCompras/CircuitoCompras';
import OrganigramaAdm from './components/Modules/OrganigramaAdm/OrganigramaAdm';
import CargaComunicaciones from './components/Modules/CargaComunicaciones/CargaComunicaciones';
import Perfil from './components/Modules/Perfil/Perfil';
import Evaluacion from './components/Modules/CargaEvaluacionDesempenio/Evaluacion';
import EvaluacionesDesempenio from './components/Modules/EvaluacionesDesempenio/EvaluacionesDesempenio';
import RespuestasEvaluacion from './components/Modules/EvaluacionesDesempenio/RepuestasEvaluacion';
import IndicadoresGlobales from './components/Modules/IndicadoresGlobales/IndicadoresGlobales';
import Empleados from './components/Modules/Empleados/Empleados';
import EscorialGPT from './components/Modules/EscorialGPT/EscorialGPT';
import Lockers from './components/Modules/Lockers/Lockers';
import Reclutamiento from './components/Modules/Reclutamiento/Reclutamiento';
import RequerimientoPersonal from './components/Modules/Reclutamiento/RequerimientoPersonal';
import ListadoRequerimientoPersonal from './components/Modules/Reclutamiento/ListadoRequerimientoPersonal';
import EvaluacionMBTI from './components/Modules/EvaluacionMBTI/EvaluacionMBTI';
import ListadoEvaluacionesMBTI from './components/Modules/EvaluacionMBTI/ListadoEvaluacionesMBTI';
import LegajoEmpleado from './components/Modules/LegajoEmpleado/LegajoEmpleado';
import Empleado from './components/Modules/LegajoEmpleado/Empleado';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/login'></Route>
        <Route path='*' element={<NavBar/>}></Route>
      </Routes>
    
      <div className="mainContainer">
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/" element={<Main/>}></Route>
          <Route path="/perfil" element={<Perfil/>}></Route>
          <Route path="/archive-explorer" element={<div className='m-container'><MenuBar/><ArchiveExplorer/></div>}></Route>
          <Route path="/organigrama" element={<div className='m-container'><MenuBar/><Organigrama/></div>}></Route>
          <Route path="/organigrama-adm" element={<div className='m-container'><MenuBar/><OrganigramaAdm/></div>}></Route>
          <Route path="/circuito-compras" element={<div className='m-container'><MenuBar/><CircuitoCompras/></div>}></Route>
          <Route path="/carga-comunicaciones" element={<div className='m-container'><MenuBar/><CargaComunicaciones/></div>}></Route>
          <Route path="/evaluacion-desempenio/:id/:usuario" element={<div className='m-container'><MenuBar/><Evaluacion/></div>}></Route>
          <Route path="/evaluaciones-desempenio" element={<div className='m-container'><MenuBar/><EvaluacionesDesempenio/></div>}></Route>
          <Route path="/respuestas-evaluacion-desempenio/:id" element={<div className='m-container'><MenuBar/><RespuestasEvaluacion/></div>}></Route>
          <Route path="/indicadores-globales" element={<div className='m-container'><MenuBar/><IndicadoresGlobales/></div>}></Route>
          <Route path="/empleados" element={<div className='m-container'><MenuBar/><Empleados/></div>}></Route>
          <Route path="/escorialgpt" element={<div className='m-container'><MenuBar/><EscorialGPT/></div>}></Route>
          <Route path="/lockers" element={<div className='m-container'><MenuBar/><Lockers/></div>}></Route>
          <Route path="/reclutamiento" element={<div className='m-container'><MenuBar/><Reclutamiento/></div>}></Route>
          <Route path="/listado-requerimiento-personal" element={<div className='m-container'><MenuBar/><ListadoRequerimientoPersonal/></div>}></Route>
          <Route path="/requerimiento-personal/:id" element={<div className='m-container'><MenuBar/><RequerimientoPersonal/></div>}></Route>
          <Route path="/evaluacion-mbti" element={<div className='m-container'><MenuBar/><EvaluacionMBTI/></div>}></Route>
          <Route path="/listado-evaluaciones-mbti" element={<div className='m-container'><MenuBar/><ListadoEvaluacionesMBTI/></div>}></Route>
          <Route path="/legajo-empleado" element={<div className='m-container'><MenuBar/><LegajoEmpleado/></div>}></Route>
          <Route path="/empleado/:id" element={<div className='m-container'><MenuBar/><Empleado/></div>}></Route>
        </Routes>
      </div>    
      
      <Routes>
        <Route path='/'/>
        <Route path='/login'/>
        <Route path='/perfil'/>
        <Route path='*' element={<div className="footer"></div>} />
      </Routes>
    </div>
  );
}

export default App;