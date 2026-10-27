import { useEffect, useState, useRef } from 'react';
import GerenciaItem from './GerenciaItem';
import './ListadoObjetivosGer.css';
import ModalObjetivos from './ModalObjetivos';

function ListadoObjetivosGer() {

  const [gerencias, setGerencias] = useState([]);
  const [loadState, setLoadState] = useState(false);
  const [gerenciaSeleccionada, setGerenciaSeleccionada] = useState(null);
  const modalRef = useRef(null);

  // Datos de prueba (placeholder)
  const gerenciasPlaceholder = [];
  // const gerenciasPlaceholder = [
  //   {
  //     nombre: "Gerencia de RRHH",
  //     objetivo: "Optimizar procesos de selección y desarrollo de talento, mejorando el clima laboral y la retención de personal clave.",
  //     descripcion: "Responsable del reclutamiento, capacitación y gestión del desempeño de los empleados.",
  //   },
  //   {
  //     nombre: "Gerencia Comercial",
  //     objetivo: "Aumentar la participación de mercado en un 25% y fortalecer las relaciones con clientes existentes.",
  //     descripcion: "Encargada de ventas, estrategia comercial y relaciones con clientes.",
  //   },
  //   {
  //     nombre: "Gerencia de Operaciones",
  //     objetivo: "Mejorar la eficiencia operativa reduciendo costos en un 15% sin afectar la calidad.",
  //     descripcion: "Supervisa la producción, logística y cumplimiento de estándares de calidad.",
  //   },
  //   {
  //     nombre: "Gerencia de Finanzas",
  //     objetivo: "Mantener un flujo de caja positivo y optimizar la estructura de costos de la empresa.",
  //     descripcion: "Gestiona presupuestos, contabilidad y análisis financiero.",
  //   },
  //   {
  //     nombre: "Gerencia de Sistemas",
  //     objetivo: "Implementar infraestructura tecnológica moderna que soporte el crecimiento de la empresa.",
  //     descripcion: "Responsable de IT, seguridad de datos y transformación digital.",
  //   },
  //   {
  //     nombre: "Gerencia de Calidad",
  //     objetivo: "Certificar procesos bajo normas internacionales y reducir no conformidades.",
  //     descripcion: "Supervisa control de calidad y cumplimiento de estándares.",
  //   },
  // ];

  const getGerencias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(process.env.REACT_APP_BASE_URL + "/objetivos-gerencias", {
        headers: {
          Authorization: token,
        }
      });
      const jsonData = await response.json();
      setGerencias(jsonData);
      setLoadState(true);
    } catch (err) {
      console.log(err.message);
      // Usar datos de prueba en caso de error
      setGerencias(gerenciasPlaceholder);
      setLoadState(true);
    }
  };

  useEffect(() => {
    getGerencias();
  }, []);

  const abrirModalGerencia = (gerencia) => {
    setGerenciaSeleccionada(gerencia);
    if (modalRef.current) {
      modalRef.current.style.display = 'flex';
    }
  };

  const cerrarModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
    setGerenciaSeleccionada(null);
  };

  return (
    <>
      <div className="listado-objetivos-ger">
        <div className="geren-header">OBJETIVOS GERENCIAS</div>
        <div className="geren-content">
          {
            loadState && gerencias.length > 0
              ? gerencias.map((gerencia, index) => (
                <div key={index} onClick={() => abrirModalGerencia(gerencia)} className='gerencia-it'>
                  <GerenciaItem value={gerencia} key={index} onClick={() => abrirModalGerencia(gerencia)}/>
                </div>
              ))
              : loadState && gerencias.length === 0
                ? <p className='texto-no-geren'>No hay gerencias cargadas</p>
                : <p className='texto-no-geren'>Cargando...</p>
          }
        </div>
      </div>
      <ModalObjetivos gerencia={gerenciaSeleccionada} onClose={cerrarModal} modalRef={modalRef} />
    </>
  );
}

export default ListadoObjetivosGer;
