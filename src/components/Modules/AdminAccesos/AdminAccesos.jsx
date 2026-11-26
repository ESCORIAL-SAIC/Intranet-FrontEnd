import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRUPO_ADMIN } from './constants';
import ListadoAccesos from './components/ListadoAccesos';
import FormAcceso from './components/FormAcceso';
import RolesAcceso from './components/RolesAcceso';
import './AdminAccesos.css';

// Solapa de administración de accesos (exclusiva administradores): ABM de las solapas del menú
// y de los roles que pueden verlas. Los cambios se reflejan en el menú al recargar la página.
function AdminAccesos() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [esAdmin, setEsAdmin] = useState(null);
    // 'listado' | 'nuevo' | 'detalle'
    const [vista, setVista] = useState('listado');
    const [accesos, setAccesos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [acceso, setAcceso] = useState(null);
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
            let admin = false;
            try {
                await axios.get(`${baseURL}/perteneceagrupo`, { headers: { Authorization: token, GrupoUsuario: GRUPO_ADMIN } });
                admin = true;
            } catch (err) {
                admin = false;
            }
            setEsAdmin(admin);
            if (admin) {
                await Promise.all([cargarAccesos(), cargarRoles()]);
            }
        })();
    }, []);

    const cargarAccesos = async () => {
        setCargando(true);
        try {
            const response = await axios.get(`${baseURL}/admin-accesos/accesos`, axiosConfig);
            setAccesos(response.data.accesos);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error obteniendo los accesos'));
        }
        setCargando(false);
    };

    const cargarRoles = async () => {
        try {
            const response = await axios.get(`${baseURL}/admin-accesos/roles`, axiosConfig);
            setRoles(response.data.roles);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error obteniendo los roles'));
        }
    };

    const irAListado = async () => {
        setVista('listado');
        setAcceso(null);
        await cargarAccesos();
    };

    const verAcceso = (a) => {
        setAcceso(a);
        setVista('detalle');
    };

    const guardarAcceso = async (datos) => {
        setGuardando(true);
        try {
            const response = acceso
                ? await axios.put(`${baseURL}/admin-accesos/accesos/${acceso.id}`, datos, axiosConfig)
                : await axios.post(`${baseURL}/admin-accesos/accesos`, datos, axiosConfig);
            setAcceso(response.data.acceso);
            setVista('detalle');
            avisar('exito', acceso
                ? 'Acceso actualizado.'
                : 'Acceso creado. Asignale al menos un rol para que aparezca en el menú.');
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error guardando el acceso'));
        }
        setGuardando(false);
    };

    const eliminarAcceso = async () => {
        if (!window.confirm(`¿Eliminar el acceso "${acceso.name}"? Dejará de aparecer en el menú para todos los roles.`)) return;
        setGuardando(true);
        try {
            await axios.delete(`${baseURL}/admin-accesos/accesos/${acceso.id}`, axiosConfig);
            avisar('exito', 'Acceso eliminado.');
            await irAListado();
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error eliminando el acceso'));
        }
        setGuardando(false);
    };

    const agregarRol = async (rol) => {
        setGuardando(true);
        try {
            const response = await axios.post(`${baseURL}/admin-accesos/accesos/${acceso.id}/roles`, { rol_id: rol.id }, axiosConfig);
            setAcceso(response.data.acceso);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error agregando el rol'));
        }
        setGuardando(false);
    };

    const quitarRol = async (rol) => {
        if (!window.confirm(`¿Quitar el rol "${rol.nombre}" del acceso "${acceso.name}"?`)) return;
        setGuardando(true);
        try {
            const response = await axios.delete(`${baseURL}/admin-accesos/accesos/${acceso.id}/roles/${rol.id}`, axiosConfig);
            setAcceso(response.data.acceso);
        } catch (err) {
            console.log(err);
            avisar('error', errorDe(err, 'Error quitando el rol'));
        }
        setGuardando(false);
    };

    const renderContenido = () => {
        if (esAdmin === null) return <div className="aa-vacio">Cargando...</div>;
        if (!esAdmin) return <div className="aa-vacio">Esta sección es de uso exclusivo de administradores.</div>;

        switch (vista) {
            case 'nuevo':
                return <FormAcceso key="nuevo" acceso={null} guardando={guardando}
                                   onGuardar={guardarAcceso} onCancelar={irAListado} />;
            case 'detalle':
                return (
                    <div>
                        <div className="aa-detalle-header">
                            <i className="material-symbols-outlined">{acceso.img_icon || 'link'}</i>
                            <div>
                                <div className="aa-detalle-titulo">{acceso.name}</div>
                                <div className="aa-detalle-sub">{acceso.link}</div>
                            </div>
                        </div>
                        <RolesAcceso acceso={acceso} roles={roles} guardando={guardando}
                                     onAgregar={agregarRol} onQuitar={quitarRol} />
                        <FormAcceso key={acceso.id} acceso={acceso} guardando={guardando}
                                    onGuardar={guardarAcceso} onCancelar={irAListado} onEliminar={eliminarAcceso} />
                    </div>
                );
            default:
                return <ListadoAccesos accesos={accesos} cargando={cargando} onVer={verAcceso}
                                       onNuevo={() => { setAcceso(null); setVista('nuevo'); }} />;
        }
    };

    return (
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">admin_panel_settings</i>
                <p className="seccion-titulo">ADMINISTRACIÓN DE ACCESOS</p>
            </div>
            <div className="aa-solapa-principal">
                {esAdmin && (
                    <div className="aa-subselector">
                        <a href="#" className={`aa-subselector-boton ${vista !== 'nuevo' ? 'active' : ''}`}
                           onClick={(e) => { e.preventDefault(); irAListado(); }}>Accesos</a>
                        <a href="#" className={`aa-subselector-boton ${vista === 'nuevo' ? 'active' : ''}`}
                           onClick={(e) => { e.preventDefault(); setAcceso(null); setVista('nuevo'); }}>Nuevo acceso</a>
                    </div>
                )}
                {mensaje && <div className={`aa-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
                <div className="aa-contenido">
                    {renderContenido()}
                </div>
            </div>
        </div>
    );
}

export default AdminAccesos;
