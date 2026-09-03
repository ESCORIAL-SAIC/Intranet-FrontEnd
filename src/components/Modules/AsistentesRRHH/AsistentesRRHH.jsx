import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AsistentesRRHH.css';

import AgenteSelector from './components/AgenteSelector';
import ConversacionList from './components/ConversacionList';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

function AsistentesRRHH() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [autorizado, setAutorizado] = useState(false);
    const [agentes, setAgentes] = useState([]);
    const [agenteKey, setAgenteKey] = useState(null);
    const [conversaciones, setConversaciones] = useState([]);
    const [conversacionId, setConversacionId] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [loadingConversaciones, setLoadingConversaciones] = useState(false);
    const [loadingMensajes, setLoadingMensajes] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    const showToast = (message, type = 'error') => {
        clearTimeout(toastTimeoutRef.current);
        setToast({ message, type });
        toastTimeoutRef.current = setTimeout(() => setToast(null), 5000);
    };

    // Gate de acceso: exclusivo RRHH
    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        axios.get(`${baseURL}/perteneceagrupo`, {
            headers: { Authorization: token, GrupoUsuario: "'rrhh'" }
        }).then(() => {
            setAutorizado(true);
        }).catch(() => {
            navigate('/');
        });
    }, [navigate, baseURL, token]);

    // Carga la lista de agentes disponibles
    useEffect(() => {
        if (!autorizado) return;
        axios.get(`${baseURL}/chat-agentes`, axiosConfig)
            .then(res => {
                setAgentes(res.data || []);
                if (res.data && res.data.length > 0) setAgenteKey(res.data[0].key);
            })
            .catch(() => showToast('Error cargando los agentes disponibles'));
    }, [autorizado]);

    const cargarConversaciones = useCallback(async (key) => {
        if (!key) return;
        try {
            setLoadingConversaciones(true);
            const res = await axios.get(`${baseURL}/chat-conversaciones`, { ...axiosConfig, params: { agente_key: key } });
            setConversaciones(res.data || []);
        } catch (err) {
            showToast('Error cargando el historial de conversaciones');
        } finally {
            setLoadingConversaciones(false);
        }
    }, [baseURL]);

    // Al cambiar de agente: recarga sus conversaciones y limpia el chat activo
    useEffect(() => {
        if (!agenteKey) return;
        setConversacionId(null);
        setMensajes([]);
        cargarConversaciones(agenteKey);
    }, [agenteKey, cargarConversaciones]);

    const abrirConversacion = async (id) => {
        try {
            setLoadingMensajes(true);
            const res = await axios.get(`${baseURL}/chat-conversaciones/${id}`, axiosConfig);
            setConversacionId(id);
            setMensajes(res.data.mensajes || []);
        } catch (err) {
            showToast('Error abriendo la conversación');
        } finally {
            setLoadingMensajes(false);
        }
    };

    const nuevaConversacion = () => {
        setConversacionId(null);
        setMensajes([]);
    };

    const enviarMensaje = async (contenido, archivos) => {
        if (!agenteKey) return;
        if (!contenido.trim() && archivos.length === 0) return;

        setEnviando(true);
        try {
            let idActivo = conversacionId;
            if (!idActivo) {
                const res = await axios.post(`${baseURL}/chat-conversaciones`, { agente_key: agenteKey }, axiosConfig);
                idActivo = res.data.id;
                setConversacionId(idActivo);
            }

            const formData = new FormData();
            formData.append('contenido', contenido);
            archivos.forEach(f => formData.append('archivos', f));

            const res = await axios.post(
                `${baseURL}/chat-conversaciones/${idActivo}/mensajes`,
                formData,
                { headers: { Authorization: token } }
            );

            setMensajes(prev => [...prev, res.data.mensaje_usuario, res.data.mensaje_asistente]);
            cargarConversaciones(agenteKey);
        } catch (err) {
            showToast(err.response?.data?.error || 'Error enviando el mensaje');
        } finally {
            setEnviando(false);
        }
    };

    const eliminarConversacion = async (id) => {
        try {
            await axios.delete(`${baseURL}/chat-conversaciones/${id}`, axiosConfig);
            if (id === conversacionId) nuevaConversacion();
            cargarConversaciones(agenteKey);
        } catch (err) {
            showToast('Error eliminando la conversación');
        }
    };

    if (!autorizado) return null;

    const agenteActivo = agentes.find(a => a.key === agenteKey);

    return (
        <div className="container arh-container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">forum</i>
                <p className="seccion-titulo">ASISTENTES RRHH</p>
            </div>

            <section className="arh-hero">
                <div className="arh-eyebrow">Escorial - Sistema de Talento 2026</div>
                <h1>Asistentes RRHH</h1>
                <p className="arh-subhead">
                    Elegí un asistente especializado y conversá con él — podés ir adjuntando documentos (PDF) a medida que avanza la conversación.
                </p>
            </section>

            <div className="arh-layout">
                <aside className="arh-sidebar">
                    <AgenteSelector agentes={agentes} agenteKey={agenteKey} onSelect={setAgenteKey} />
                    <ConversacionList
                        conversaciones={conversaciones}
                        conversacionId={conversacionId}
                        loading={loadingConversaciones}
                        onSelect={abrirConversacion}
                        onNueva={nuevaConversacion}
                        onEliminar={eliminarConversacion}
                    />
                </aside>

                <main className="arh-chat-panel">
                    <div className="arh-chat-header">
                        <span className="arh-chat-header-nombre">{agenteActivo?.nombre || 'Seleccioná un asistente'}</span>
                        {agenteActivo && <span className="arh-chat-header-desc">{agenteActivo.descripcion}</span>}
                    </div>
                    <ChatWindow mensajes={mensajes} loading={loadingMensajes} enviando={enviando} />
                    <ChatInput onEnviar={enviarMensaje} disabled={!agenteKey || enviando} />
                </main>
            </div>

            {toast && <div className={`arh-toast arh-toast-${toast.type}`}>{toast.message}</div>}
        </div>
    );
}

export default AsistentesRRHH;
