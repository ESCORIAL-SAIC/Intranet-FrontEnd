import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PendientesFormulario from '../PendientesFormulario';
import GestionCiclos from '../GestionCiclos';
import RegistroListRiesgoImpacto from './RegistroListRiesgoImpacto';
import DetalleRiesgoImpacto from './DetalleRiesgoImpacto';

const GRUPO_ADMIN = "'Direccion','administradores','rrhh'";
const TIPO = 'riesgo-impacto';

// RRHH/Dirección/administradores abren un ciclo (ventana de fechas) y, además, conservan el
// listado completo para supervisión. Mientras el ciclo está vigente, cualquier líder ve y
// completa el formulario de sus reportes directos (1 solo nivel).
function RiesgoImpactoTab() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [esAdmin, setEsAdmin] = useState(false);
    const [vista, setVista] = useState('pendientes'); // 'pendientes' | 'listado' | 'ciclos' | 'detalle'
    const [origenDetalle, setOrigenDetalle] = useState('pendientes');

    const [pendientes, setPendientes] = useState({ ciclo: null, items: [] });
    const [registros, setRegistros] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [registroActual, setRegistroActual] = useState(null);

    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const avisar = (tipo, texto) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje(null), 4000);
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        (async () => {
            let admin = false;
            try {
                await axios.get(`${baseURL}/perteneceagrupo`, { headers: { Authorization: token, GrupoUsuario: GRUPO_ADMIN } });
                admin = true;
            } catch (err) {
                admin = false;
            }
            setEsAdmin(admin);
            await cargarPendientes();
            setCargandoInicial(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarPendientes = async () => {
        try {
            const response = await axios.get(`${baseURL}/rrhh-formularios/pendientes/${TIPO}`, axiosConfig);
            setPendientes({ ciclo: response.data.ciclo, items: response.data.items || [] });
        } catch (err) {
            console.log(err);
        }
    };

    const cargarListado = async () => {
        try {
            const response = await axios.get(`${baseURL}/rrhh-formularios/${TIPO}`, axiosConfig);
            setRegistros(response.data.registros || []);
        } catch (err) {
            console.log(err);
        }
    };

    const cargarCiclos = async () => {
        try {
            const response = await axios.get(`${baseURL}/rrhh-formularios/ciclos/${TIPO}`, axiosConfig);
            setCiclos(response.data.ciclos || []);
        } catch (err) {
            console.log(err);
        }
    };

    const irAVista = async (nuevaVista) => {
        setVista(nuevaVista);
        if (nuevaVista === 'pendientes') await cargarPendientes();
        if (nuevaVista === 'listado') await cargarListado();
        if (nuevaVista === 'ciclos') await cargarCiclos();
    };

    const seleccionarRegistro = async (id, origen) => {
        try {
            const response = await axios.get(`${baseURL}/rrhh-formularios/${TIPO}/${id}`, axiosConfig);
            setRegistroActual({ ...response.data.registro, puede_editar: response.data.puede_editar });
            setOrigenDetalle(origen);
            setVista('detalle');
        } catch (err) {
            console.log(err);
            avisar('error', 'No se pudo cargar el registro seleccionado');
        }
    };

    const iniciarRegistro = async (empleadoId) => {
        setGuardando(true);
        try {
            const response = await axios.post(`${baseURL}/rrhh-formularios/iniciar/${TIPO}`, { empleado_id: empleadoId }, axiosConfig);
            await seleccionarRegistro(response.data.registro.id, 'pendientes');
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error iniciando el formulario');
        } finally {
            setGuardando(false);
        }
    };

    const guardarRegistro = async (payload) => {
        setGuardando(true);
        try {
            const response = await axios.put(`${baseURL}/rrhh-formularios/${TIPO}/${registroActual.id}`, payload, axiosConfig);
            setRegistroActual(prev => ({ ...response.data.registro, puede_editar: prev.puede_editar && response.data.registro.estado === 'borrador' }));
            avisar('exito', payload.estado === 'finalizado' ? 'Registro finalizado correctamente' : 'Registro guardado correctamente');
            return true;
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error guardando el registro');
            return false;
        } finally {
            setGuardando(false);
        }
    };

    const eliminarRegistro = async () => {
        setGuardando(true);
        try {
            await axios.delete(`${baseURL}/rrhh-formularios/${TIPO}/${registroActual.id}`, axiosConfig);
            avisar('exito', 'Registro eliminado');
            volver();
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error eliminando el registro');
        } finally {
            setGuardando(false);
        }
    };

    const crearCiclo = async (payload) => {
        setGuardando(true);
        try {
            await axios.post(`${baseURL}/rrhh-formularios/ciclos/${TIPO}`, payload, axiosConfig);
            avisar('exito', 'Ciclo creado correctamente');
            await cargarCiclos();
            return true;
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error creando el ciclo');
            return false;
        } finally {
            setGuardando(false);
        }
    };

    const editarCiclo = async (id, payload) => {
        setGuardando(true);
        try {
            await axios.put(`${baseURL}/rrhh-formularios/ciclos/${id}`, payload, axiosConfig);
            avisar('exito', 'Ciclo actualizado correctamente');
            await cargarCiclos();
            return true;
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error actualizando el ciclo');
            return false;
        } finally {
            setGuardando(false);
        }
    };

    const eliminarCiclo = async (id) => {
        setGuardando(true);
        try {
            await axios.delete(`${baseURL}/rrhh-formularios/ciclos/${id}`, axiosConfig);
            avisar('exito', 'Ciclo eliminado');
            await cargarCiclos();
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error eliminando el ciclo');
        } finally {
            setGuardando(false);
        }
    };

    const volver = () => {
        setRegistroActual(null);
        irAVista(origenDetalle);
    };

    if (cargandoInicial) {
        return <div className="rf-vacio">Cargando...</div>;
    }

    return (
        <div className="rf-riesgo-impacto">
            {esAdmin && vista !== 'detalle' && (
                <div className="rf-subselector">
                    <a href="#" className={`rf-subselector-boton ${vista === 'pendientes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); irAVista('pendientes'); }}>Pendientes</a>
                    <a href="#" className={`rf-subselector-boton ${vista === 'listado' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); irAVista('listado'); }}>Listado</a>
                    <a href="#" className={`rf-subselector-boton ${vista === 'ciclos' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); irAVista('ciclos'); }}>Ciclos</a>
                </div>
            )}

            {mensaje && <div className={`rf-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

            {vista === 'pendientes' && (
                <PendientesFormulario
                    ciclo={pendientes.ciclo}
                    items={pendientes.items}
                    onCompletar={iniciarRegistro}
                    onVer={(id) => seleccionarRegistro(id, 'pendientes')}
                    guardando={guardando}
                />
            )}

            {vista === 'listado' && (
                <RegistroListRiesgoImpacto registros={registros} onSeleccionar={(id) => seleccionarRegistro(id, 'listado')} />
            )}

            {vista === 'ciclos' && (
                <GestionCiclos
                    ciclos={ciclos}
                    onCrear={crearCiclo}
                    onEditar={editarCiclo}
                    onEliminar={eliminarCiclo}
                    guardando={guardando}
                />
            )}

            {vista === 'detalle' && registroActual && (
                <>
                    <button type="button" className="rf-boton-secundario rf-volver" onClick={volver}>
                        <i className="material-symbols-outlined">arrow_back</i> Volver
                    </button>
                    <DetalleRiesgoImpacto
                        registro={registroActual}
                        onGuardar={guardarRegistro}
                        onEliminar={eliminarRegistro}
                        guardando={guardando}
                        mensaje={mensaje}
                    />
                </>
            )}
        </div>
    );
}

export default RiesgoImpactoTab;
