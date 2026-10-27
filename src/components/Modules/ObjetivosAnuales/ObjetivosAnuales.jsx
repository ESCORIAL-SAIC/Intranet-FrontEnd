import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ObjetivosAnuales.css';

import RegistroList from './components/RegistroList';
import NuevoRegistroForm from './components/NuevoRegistroForm';
import DetalleObjetivo from './components/DetalleObjetivo';

const GRUPO_ADMIN = "'Direccion','administradores','rrhh'";

function ObjetivosAnuales() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [esAdmin, setEsAdmin] = useState(false);
    const [vista, setVista] = useState('lista'); // 'lista' | 'nuevo' | 'detalle'
    const [registros, setRegistros] = useState([]);
    const [registroActual, setRegistroActual] = useState(null);
    const [pilaresActual, setPilaresActual] = useState([]);
    const [puedeEditar, setPuedeEditar] = useState(false);
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
        axios.get(`${baseURL}/main`, axiosConfig).catch(() => navigate('/login'));

        (async () => {
            let admin = false;
            try {
                await axios.get(`${baseURL}/perteneceagrupo`, { headers: { Authorization: token, GrupoUsuario: GRUPO_ADMIN } });
                admin = true;
            } catch (err) {
                admin = false;
            }
            setEsAdmin(admin);
            await cargarRegistros(admin);
            setCargandoInicial(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarRegistros = async (admin) => {
        try {
            const response = await axios.get(`${baseURL}/objetivos-anuales`, axiosConfig);
            const lista = response.data.registros || [];
            setRegistros(lista);
            if (admin) {
                setVista('lista');
            } else if (lista.length > 0) {
                await seleccionarRegistro(lista[0].id);
            } else {
                setVista('vacio');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const seleccionarRegistro = async (id) => {
        try {
            const response = await axios.get(`${baseURL}/objetivos-anuales/${id}`, axiosConfig);
            setRegistroActual(response.data.registro);
            setPilaresActual(response.data.pilares);
            setPuedeEditar(response.data.puede_editar === true);
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
            const response = await axios.post(`${baseURL}/objetivos-anuales`, payload, axiosConfig);
            avisar('exito', 'Registro creado correctamente');
            await cargarRegistros(true);
            await seleccionarRegistro(response.data.registro.id);
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error creando el registro');
        } finally {
            setGuardando(false);
        }
    };

    const guardarPilares = async (pilaresEditados) => {
        setGuardando(true);
        try {
            const response = await axios.put(`${baseURL}/objetivos-anuales/${registroActual.id}/pilares`, { pilares: pilaresEditados }, axiosConfig);
            setPilaresActual(response.data.pilares);
            avisar('exito', 'Pilares actualizados correctamente');
            return true;
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error guardando los pilares');
            return false;
        } finally {
            setGuardando(false);
        }
    };

    const guardarResultado = async (pilarId, resultadoReal) => {
        setGuardando(true);
        try {
            const response = await axios.put(
                `${baseURL}/objetivos-anuales/${registroActual.id}/pilar/${pilarId}/resultado`,
                { resultado_real: resultadoReal },
                axiosConfig
            );
            setPilaresActual(prev => prev.map(p => (p.id === pilarId ? response.data.pilar : p)));
            setRegistroActual(response.data.registro);
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error guardando el resultado');
        } finally {
            setGuardando(false);
        }
    };

    const publicar = async () => {
        setGuardando(true);
        try {
            const response = await axios.put(`${baseURL}/objetivos-anuales/${registroActual.id}`, { estado: 'publicado' }, axiosConfig);
            setRegistroActual(response.data.registro);
            avisar('exito', 'Registro publicado correctamente');
            await cargarRegistros(true);
        } catch (err) {
            avisar('error', err.response?.data?.error || 'Error publicando el registro');
        } finally {
            setGuardando(false);
        }
    };

    const volverALista = () => {
        setRegistroActual(null);
        setPilaresActual([]);
        cargarRegistros(true);
    };

    return (
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">flag</i>
                <p className="seccion-titulo">OBJETIVOS ANUALES</p>
            </div>

            {cargandoInicial ? (
                <div className="oa-vacio">Cargando...</div>
            ) : (
                <div className="oa-objetivos-anuales">
                    {esAdmin && vista === 'lista' && (
                        <>
                            <div className="oa-toolbar">
                                <button type="button" className="oa-boton-guardar" onClick={() => setVista('nuevo')}>
                                    <i className="material-symbols-outlined">add</i> Nuevo registro
                                </button>
                            </div>
                            {mensaje && <div className={`oa-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
                            <RegistroList registros={registros} onSeleccionar={seleccionarRegistro} />
                        </>
                    )}

                    {esAdmin && vista === 'nuevo' && (
                        <NuevoRegistroForm
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
                            {esAdmin && (
                                <button type="button" className="oa-boton-secundario oa-volver" onClick={volverALista}>
                                    <i className="material-symbols-outlined">arrow_back</i> Volver al listado
                                </button>
                            )}
                            <DetalleObjetivo
                                registro={registroActual}
                                pilares={pilaresActual}
                                soloLectura={!esAdmin}
                                puedeEditarPilares={puedeEditar && registroActual.estado === 'borrador'}
                                onGuardarPilares={guardarPilares}
                                onGuardarResultado={guardarResultado}
                                onPublicar={publicar}
                                guardando={guardando}
                                mensaje={mensaje}
                            />
                        </>
                    )}

                    {vista === 'vacio' && (
                        <div className="oa-vacio">Todavía no tenés objetivos anuales cargados.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ObjetivosAnuales;
