import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import RegistroListGuiaPotencial from './RegistroListGuiaPotencial';
import NuevoGuiaPotencialForm from './NuevoGuiaPotencialForm';
import DetalleGuiaPotencial from './DetalleGuiaPotencial';

const GRUPO_ADMIN = "'Direccion','administradores','rrhh'";

// Acceso exclusivo Dirección/administradores/RRHH — el colaborador evaluado nunca tiene
// acceso a estos registros (ver nota de confidencialidad en el maquetado de referencia).
function GuiaPotencialTab() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [esAdmin, setEsAdmin] = useState(false);
    const [vista, setVista] = useState('lista'); // 'lista' | 'nuevo' | 'detalle'
    const [registros, setRegistros] = useState([]);
    const [registroActual, setRegistroActual] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [empleadosBusqueda, setEmpleadosBusqueda] = useState('');
    const [empleadosResultados, setEmpleadosResultados] = useState([]);

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
            if (admin) await cargarRegistros();
            setCargandoInicial(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarRegistros = async () => {
        try {
            const response = await axios.get(`${baseURL}/rrhh-formularios/guia-potencial`, axiosConfig);
            setRegistros(response.data.registros || []);
            setVista('lista');
        } catch (err) {
            console.log(err);
        }
    };

    const seleccionarRegistro = async (id) => {
        try {
            const response = await axios.get(`${baseURL}/rrhh-formularios/guia-potencial/${id}`, axiosConfig);
            setRegistroActual(response.data.registro);
            setVista('detalle');
        } catch (err) {
            console.log(err);
            avisar('error', 'No se pudo cargar el registro seleccionado');
        }
    };

    const buscarEmpleados = async (query) => {
        setEmpleadosBusqueda(query);
        if (!query || query.trim().length < 2) {
            setEmpleadosResultados([]);
            return;
        }
        try {
            const response = await axios.get(`${baseURL}/legajos-empleados`, { headers: { Authorization: token, busqueda: query } });
            setEmpleadosResultados(response.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const crearRegistro = async (payload) => {
        setGuardando(true);
        try {
            const response = await axios.post(`${baseURL}/rrhh-formularios/guia-potencial`, payload, axiosConfig);
            avisar('exito', 'Registro creado correctamente');
            await cargarRegistros();
            await seleccionarRegistro(response.data.registro.id);
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error creando el registro');
        } finally {
            setGuardando(false);
        }
    };

    const guardarRegistro = async (payload) => {
        setGuardando(true);
        try {
            const response = await axios.put(`${baseURL}/rrhh-formularios/guia-potencial/${registroActual.id}`, payload, axiosConfig);
            setRegistroActual(response.data.registro);
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
            await axios.delete(`${baseURL}/rrhh-formularios/guia-potencial/${registroActual.id}`, axiosConfig);
            avisar('exito', 'Registro eliminado');
            volverALista();
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error eliminando el registro');
        } finally {
            setGuardando(false);
        }
    };

    const volverALista = () => {
        setRegistroActual(null);
        cargarRegistros();
    };

    if (cargandoInicial) {
        return <div className="rf-vacio">Cargando...</div>;
    }

    if (!esAdmin) {
        return <div className="rf-vacio">Acceso exclusivo para Dirección, administradores y RRHH.</div>;
    }

    return (
        <div className="rf-guia-potencial">
            {vista === 'lista' && (
                <>
                    <div className="rf-toolbar">
                        <button type="button" className="rf-boton-guardar" onClick={() => setVista('nuevo')}>
                            <i className="material-symbols-outlined">add</i> Nuevo registro
                        </button>
                    </div>
                    {mensaje && <div className={`rf-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
                    <RegistroListGuiaPotencial registros={registros} onSeleccionar={seleccionarRegistro} />
                </>
            )}

            {vista === 'nuevo' && (
                <NuevoGuiaPotencialForm
                    empleados={empleadosResultados}
                    busqueda={empleadosBusqueda}
                    onBuscar={buscarEmpleados}
                    onCrear={crearRegistro}
                    onCancelar={() => setVista('lista')}
                    guardando={guardando}
                    mensaje={mensaje}
                />
            )}

            {vista === 'detalle' && registroActual && (
                <>
                    <button type="button" className="rf-boton-secundario rf-volver" onClick={volverALista}>
                        <i className="material-symbols-outlined">arrow_back</i> Volver al listado
                    </button>
                    <DetalleGuiaPotencial
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

export default GuiaPotencialTab;
