import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRUPO_RRHH, OPCIONES_DIAS_NUEVOS } from './constants';
import ListadoRoadmaps from './components/ListadoRoadmaps';
import SeleccionEmpleado from './components/SeleccionEmpleado';
import FormRoadmap from './components/FormRoadmap';
import DetalleRoadmap from './components/DetalleRoadmap';
import './RRHHInduccion.css';

// Solapa de gestión de inducciones (exclusiva RRHH). El colaborador ve su roadmap en Perfil
// (ver Perfil/MiInduccion.jsx).
function RRHHInduccion() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [esRRHH, setEsRRHH] = useState(null);
    // 'listado' | 'seleccion' | 'form' | 'detalle'
    const [vista, setVista] = useState('listado');
    const [roadmaps, setRoadmaps] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [dias, setDias] = useState(OPCIONES_DIAS_NUEVOS[1]);
    const [catalogo, setCatalogo] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const avisar = (tipo, texto) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje(null), 5000);
    };
    const errorDe = (err, fallback) => (err.response && err.response.data && err.response.data.error) || fallback;

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        (async () => {
            let rrhh = false;
            try {
                await axios.get(`${baseURL}/perteneceagrupo`, { headers: { Authorization: token, GrupoUsuario: GRUPO_RRHH } });
                rrhh = true;
            } catch (err) {
                rrhh = false;
            }
            setEsRRHH(rrhh);
            if (rrhh) {
                await Promise.all([cargarRoadmaps(), cargarCatalogo()]);
            }
        })();
    }, []);

    const cargarRoadmaps = async () => {
        setCargando(true);
        try {
            const response = await axios.get(`${baseURL}/induccion/roadmaps`, axiosConfig);
            setRoadmaps(response.data.roadmaps);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error obteniendo los roadmaps'));
        }
        setCargando(false);
    };

    const cargarCatalogo = async () => {
        try {
            const response = await axios.get(`${baseURL}/induccion/catalogo`, axiosConfig);
            setCatalogo(response.data.catalogo);
        } catch (err) {
            console.log(err);
        }
    };

    const cargarEmpleados = async (cantidadDias) => {
        setCargando(true);
        try {
            const response = await axios.get(`${baseURL}/induccion/empleados-nuevos`, { ...axiosConfig, params: { dias: cantidadDias } });
            setEmpleados(response.data.empleados);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error obteniendo los colaboradores'));
        }
        setCargando(false);
    };

    const irAListado = async () => {
        setVista('listado');
        setRoadmap(null);
        setEmpleadoSeleccionado(null);
        await cargarRoadmaps();
    };

    const irASeleccion = async () => {
        setVista('seleccion');
        await cargarEmpleados(dias);
    };

    const cambiarDias = async (nuevosDias) => {
        setDias(nuevosDias);
        await cargarEmpleados(nuevosDias);
    };

    const seleccionarEmpleado = async (empleado) => {
        try {
            const response = await axios.get(`${baseURL}/induccion/empleados/${empleado.id}/datos`, axiosConfig);
            setEmpleadoSeleccionado(response.data.empleado);
            setRoadmap(null);
            setVista('form');
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error obteniendo los datos del colaborador'));
        }
    };

    const verRoadmap = async (id) => {
        try {
            const response = await axios.get(`${baseURL}/induccion/roadmaps/${id}`, axiosConfig);
            setRoadmap(response.data.roadmap);
            setVista('detalle');
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error obteniendo el roadmap'));
        }
    };

    const guardarRoadmap = async (payload) => {
        setGuardando(true);
        try {
            const response = roadmap
                ? await axios.put(`${baseURL}/induccion/roadmaps/${roadmap.id}`, payload, axiosConfig)
                : await axios.post(`${baseURL}/induccion/roadmaps`, payload, axiosConfig);
            setRoadmap(response.data.roadmap);
            setVista('detalle');
            avisar('exito', payload.estado === 'publicado'
                ? 'Checklist publicado. El recorrido ya puede ser consultado por el colaborador desde su Perfil.'
                : 'Checklist guardado como borrador.');
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error guardando el roadmap'));
        }
        setGuardando(false);
    };

    const toggleItem = async (item) => {
        setGuardando(true);
        try {
            const response = await axios.put(`${baseURL}/induccion/items/${item.id}/completada`, { completada: !item.completada }, axiosConfig);
            setRoadmap(response.data.roadmap);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error actualizando la inducción'));
        }
        setGuardando(false);
    };

    const eliminarRoadmap = async () => {
        if (!window.confirm(`¿Eliminar el roadmap de ${roadmap.nombre_snapshot}? Esta acción no se puede deshacer.`)) return;
        setGuardando(true);
        try {
            await axios.delete(`${baseURL}/induccion/roadmaps/${roadmap.id}`, axiosConfig);
            avisar('exito', 'Roadmap eliminado.');
            await irAListado();
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error eliminando el roadmap'));
        }
        setGuardando(false);
    };

    const renderContenido = () => {
        if (esRRHH === null) return <div className="ri-vacio">Cargando...</div>;
        if (!esRRHH) return <div className="ri-vacio">Esta sección es de uso exclusivo de RRHH.</div>;

        switch (vista) {
            case 'seleccion':
                return <SeleccionEmpleado empleados={empleados} dias={dias} cargando={cargando}
                                          onCambiarDias={cambiarDias} onSeleccionar={seleccionarEmpleado} onVerRoadmap={verRoadmap} />;
            case 'form':
                return <FormRoadmap key={roadmap ? roadmap.id : empleadoSeleccionado.id}
                                    empleado={empleadoSeleccionado} roadmap={roadmap} catalogo={catalogo} guardando={guardando}
                                    onGuardar={guardarRoadmap}
                                    onCancelar={() => roadmap ? setVista('detalle') : setVista('seleccion')} />;
            case 'detalle':
                return <DetalleRoadmap roadmap={roadmap} guardando={guardando} onToggleItem={toggleItem}
                                       onEditar={() => setVista('form')} onEliminar={eliminarRoadmap} />;
            default:
                return <ListadoRoadmaps roadmaps={roadmaps} cargando={cargando} onVer={verRoadmap} onNuevo={irASeleccion} />;
        }
    };

    return (
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">checklist</i>
                <p className="seccion-titulo">INDUCCIÓN DE COLABORADORES</p>
            </div>
            <div className="ri-solapa-principal">
                {esRRHH && (
                    <div className="ri-subselector">
                        <a href="#" className={`ri-subselector-boton ${vista === 'listado' || vista === 'detalle' ? 'active' : ''}`}
                           onClick={(e) => { e.preventDefault(); irAListado(); }}>Roadmaps</a>
                        <a href="#" className={`ri-subselector-boton ${vista === 'seleccion' || (vista === 'form' && !roadmap) ? 'active' : ''}`}
                           onClick={(e) => { e.preventDefault(); irASeleccion(); }}>Nuevo roadmap</a>
                    </div>
                )}
                {mensaje && <div className={`ri-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
                <div className="ri-contenido">
                    {renderContenido()}
                </div>
            </div>
        </div>
    );
}

export default RRHHInduccion;
