import axios from "axios";
import { useEffect, useState } from "react";
import ProgresoInduccion from "../RRHHInduccion/components/ProgresoInduccion";
import RoadmapTimeline from "../RRHHInduccion/components/RoadmapTimeline";
import InfoUtil from "../RRHHInduccion/components/InfoUtil";
import { fmt } from "../RRHHInduccion/utils";
import '../RRHHInduccion/RRHHInduccion.css';
import './MiInduccion.css';

// Circuito de inducción del colaborador logueado. Solo se muestra si RRHH le publicó un roadmap.
function MiInduccion(){
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [roadmap, setRoadmap] = useState(null);
    const [abierto, setAbierto] = useState(true);
    const [puntaje, setPuntaje] = useState(0);
    const [comentarios, setComentarios] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${baseURL}/induccion/mi-induccion`, axiosConfig);
                setRoadmap(response.data.roadmap);
                // Una inducción finalizada se muestra colapsada.
                if (response.data.roadmap && response.data.roadmap.estado === 'finalizado') setAbierto(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const enviarEncuesta = async () => {
        setGuardando(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}/induccion/mi-induccion/encuesta`, { puntaje, comentarios }, axiosConfig);
            setRoadmap(response.data.roadmap);
        } catch (err) {
            console.log(err);
            setError((err.response && err.response.data && err.response.data.error) || 'Error enviando la encuesta');
        }
        setGuardando(false);
    };

    if (!roadmap) return <></>;

    const encuestaHabilitada = !roadmap.encuesta_completada && roadmap.items.every(i => i.completada);

    return (
        <div className="mi-induccion">
            <div className="mi-induccion-titulo" onClick={() => setAbierto(!abierto)}>
                <p className="titulo-tareas-pendientes">Mi Inducción</p>
                <span className="mi-induccion-resumen">
                    {roadmap.progreso.porcentaje}% completado
                    <i className="material-symbols-outlined">{abierto ? 'expand_less' : 'expand_more'}</i>
                </span>
            </div>

            {abierto && (
                <div className="mi-induccion-contenido">
                    <h2 className="mi-induccion-bienvenida">Bienvenido/a a Escorial</h2>
                    <ProgresoInduccion progreso={roadmap.progreso} estado={roadmap.estado} />

                    <section className="ri-card">
                        <div className="ri-card-titulo">Tu recorrido de inducción</div>
                        <div className="ri-grid ri-grid-lectura mi-induccion-datos">
                            <div><div className="ri-label">Jefe directo</div>{fmt(roadmap.jefe_directo)}</div>
                            <div><div className="ri-label">Tutor RRHH</div>{fmt(roadmap.tutor_rrhh)}</div>
                            <div><div className="ri-label">Planta</div>{fmt(roadmap.planta)}</div>
                        </div>
                        <RoadmapTimeline items={roadmap.items}
                                         encuestaCompletada={roadmap.encuesta_completada}
                                         encuestaFecha={roadmap.encuesta_fecha} />
                    </section>

                    {encuestaHabilitada && (
                        <section className="ri-card">
                            <div className="ri-card-titulo">Encuesta de satisfacción</div>
                            <p className="ri-encuesta-texto">¡Completaste todas las inducciones! Contanos cómo fue tu experiencia para finalizar el proceso.</p>
                            <div className="ri-estrellas">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <span key={n} className={n <= puntaje ? 'activa' : ''} onClick={() => setPuntaje(n)}>★</span>
                                ))}
                            </div>
                            <textarea className="ri-input ri-textarea" placeholder="Comentarios (opcional)"
                                      value={comentarios} onChange={(e) => setComentarios(e.target.value)} />
                            {error && <div className="ri-mensaje error">{error}</div>}
                            <div className="ri-acciones">
                                <button type="button" className="ri-boton-primario" disabled={guardando || puntaje === 0} onClick={enviarEncuesta}>
                                    Enviar encuesta
                                </button>
                            </div>
                        </section>
                    )}

                    <section className="ri-card">
                        <div className="ri-card-titulo">Información útil</div>
                        <InfoUtil infoUtil={roadmap.info_util} />
                    </section>
                </div>
            )}
        </div>
    );
}

export default MiInduccion;
