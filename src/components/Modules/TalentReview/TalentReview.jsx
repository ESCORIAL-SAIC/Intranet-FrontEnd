import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TalentReview.css';

import { FASES, ESTADOS_OK } from './constants';
import TareaItem from './components/TareaItem';
import EquipoTabla from './components/EquipoTabla';

const ok = (estado) => ESTADOS_OK.includes(estado);

const estadoPorProgreso = ({ total, completos }) =>
    total === 0 ? 'sin_asignar' : completos === total ? 'completo' : 'pendiente';

const formatearFecha = (f) => (f ? new Date(f).toLocaleDateString('es-AR') : '');

// Hub del proceso de Talent Review (info-prompts/talent-review-proceso-general.html):
// centraliza el checklist del colaborador (Fase 0) y el roadmap del líder
// (Fase 0 → Fase 1 → 9-box), enlazando a cada módulo donde se carga la información.
export default function TalentReview() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: token } };

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        axios.get(`${baseURL}/main`, axiosConfig).catch(() => navigate('/login'));
        axios.get(`${baseURL}/talent-review/estado`, axiosConfig)
            .then(r => setData(r.data))
            .catch(err => setError(err.response?.data?.error || 'No se pudo cargar el estado del Talent Review'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, baseURL, token]);

    const encabezado = (
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">route</i>
            <p className="seccion-titulo">TALENT REVIEW</p>
        </div>
    );

    if (error) return <div className="container">{encabezado}<div className="tr-mensaje error">{error}</div></div>;
    if (!data) return <div className="container">{encabezado}<div className="tr-mensaje">Cargando...</div></div>;

    const { colaborador, lider, es_lider, anio } = data;
    const autoPendiente = colaborador.autoevaluacion.items.find(a => !a.completada);

    // Fase 0 cerrada: tareas propias disponibles completas y, si es líder, equipo evaluado y objetivos cerrados.
    const fase0Colaborador = colaborador.autoevaluacion.estado !== 'pendiente' && ok(colaborador.cv_interno.estado) && ok(colaborador.mi_persona.estado);
    const fase0Lider = !es_lider || (
        lider.evaluaciones.completos === lider.evaluaciones.total &&
        lider.objetivos.completos === lider.objetivos.total
    );
    const fase0Cerrada = fase0Colaborador && fase0Lider;
    const formulariosCompletos = es_lider && lider.nuevebox.habilitado;
    const registro9box = es_lider ? lider.nuevebox.registro : null;
    const fase1Cerrada = es_lider && formulariosCompletos && registro9box && registro9box.estado !== 'borrador';

    const estadoFase = (n) => {
        if (n === 0) return fase0Cerrada ? 'hecha' : 'activa';
        if (n === 1) {
            if (!es_lider) return 'ajena';
            return fase1Cerrada ? 'hecha' : fase0Cerrada ? 'activa' : 'proxima';
        }
        return 'proxima';
    };

    const estado9box = !es_lider ? null
        : !lider.nuevebox.habilitado ? 'bloqueado'
        : !registro9box ? 'habilitado'
        : registro9box.estado === 'borrador' ? 'borrador'
        : 'completo';

    const descripcionCiclo = (ciclo) => !ciclo
        ? 'RRHH todavía no abrió el ciclo de este formulario.'
        : `${ciclo.nombre || 'Ciclo'}: ${formatearFecha(ciclo.fecha_desde)} al ${formatearFecha(ciclo.fecha_hasta)}${ciclo.vigente ? '' : ' (cerrado)'}`;

    return (
        <div className="container tr-container">
            {encabezado}

            <section className="tr-hero">
                <div className="tr-eyebrow">Escorial - Sistema de Talento {anio}</div>
                <h1>Talent Review</h1>
                <p>
                    Todo lo que tenés que completar en el ciclo, en un solo lugar.
                    {es_lider
                        ? ' Primero se recolecta la información de cada persona; con eso cerrado pasás al mapeo de talento de tu equipo.'
                        : ' Tu líder trabaja sobre lo que cargues acá, así que conviene tenerlo al día.'}
                </p>
            </section>

            <ol className="tr-fases">
                {FASES.map(f => (
                    <li key={f.n} className={`tr-fase ${estadoFase(f.n)}`}>
                        <span className="tr-fase-n">Fase {f.n}</span>
                        <span className="tr-fase-t">{f.titulo}</span>
                        {f.n >= 2 && <span className="tr-fase-s">Sesión con RRHH</span>}
                        {f.n === 1 && !es_lider && <span className="tr-fase-s">A cargo de tu líder</span>}
                    </li>
                ))}
            </ol>

            <section className="tr-bloque">
                <div className="tr-bloque-head">
                    <h2>Mis pendientes</h2>
                    <span className="tr-bloque-fase">Fase 0 · Recolección de información</span>
                </div>
                <ul className="tr-lista">
                    <TareaItem
                        icono="rate_review"
                        titulo="Autoevaluación de desempeño"
                        descripcion={colaborador.autoevaluacion.estado === 'sin_asignar'
                            ? 'No tenés una autoevaluación abierta en este momento.'
                            : autoPendiente
                                ? `${autoPendiente.tipo} · vence el ${formatearFecha(autoPendiente.fechahasta)}`
                                : 'Te evaluaste en las competencias del ciclo.'}
                        estado={colaborador.autoevaluacion.estado}
                        accion={autoPendiente && {
                            label: 'Completar',
                            onClick: () => navigate(`/evaluacion-desempenio/${autoPendiente.cuestionario_id}/${autoPendiente.usuario_evaluar}`),
                        }}
                    />
                    <TareaItem
                        icono="badge"
                        titulo="CV interno"
                        descripcion={colaborador.cv_interno.ultima_carga
                            ? `Última carga: ${formatearFecha(colaborador.cv_interno.ultima_carga)}. Si cambió algo, subí la versión nueva.`
                            : 'Subí tu CV en PDF desde tu perfil; la información se carga automáticamente.'}
                        estado={colaborador.cv_interno.estado}
                        accion={{ label: ok(colaborador.cv_interno.estado) ? 'Actualizar' : 'Subir CV', onClick: () => navigate('/perfil') }}
                    />
                    <TareaItem
                        icono="person_search"
                        titulo="Formulario Mi Persona"
                        descripcion={colaborador.mi_persona.fecha
                            ? `Completado el ${formatearFecha(colaborador.mi_persona.fecha)}.`
                            : 'Tus intereses y aspiraciones de carrera. Todavía no lo completaste.'}
                        estado={colaborador.mi_persona.estado}
                    />
                </ul>
            </section>

            {es_lider && (
                <>
                    <section className="tr-bloque">
                        <div className="tr-bloque-head">
                            <h2>Mi equipo · Recolección de información</h2>
                            <span className="tr-bloque-fase">Fase 0</span>
                        </div>
                        <ul className="tr-lista">
                            <TareaItem
                                icono="groups"
                                titulo="Evaluaciones de desempeño del equipo"
                                descripcion="Evaluá competencias, da feedback y cerrá acuerdos con cada colaborador."
                                estado={estadoPorProgreso(lider.evaluaciones)}
                                progreso={lider.evaluaciones}
                                accion={{ label: 'Ver evaluaciones', onClick: () => navigate('/perfil') }}
                            >
                                {lider.evaluaciones.items.some(e => !e.completada) && (
                                    <div className="tr-sublista">
                                        {lider.evaluaciones.items.filter(e => !e.completada).map(e => (
                                            <a key={`${e.cuestionario_id}-${e.usuario_evaluar}`}
                                                href={`/evaluacion-desempenio/${e.cuestionario_id}/${e.usuario_evaluar}`}>
                                                {e.empleado_evaluar}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </TareaItem>
                            <TareaItem
                                icono="flag"
                                titulo={`Cierre de objetivos anuales ${anio}`}
                                descripcion="Cada pilar se califica de 1 a 5 según los umbrales acordados. Coordiná con RRHH la carga de los resultados."
                                estado={estadoPorProgreso(lider.objetivos)}
                                progreso={lider.objetivos}
                                accion={{ label: 'Ver objetivos', onClick: () => navigate('/objetivos-anuales') }}
                            />
                        </ul>
                    </section>

                    <section className={`tr-bloque ${fase0Cerrada ? '' : 'tr-bloque-siguiente'}`}>
                        <div className="tr-bloque-head">
                            <h2>Mi equipo · Mapeo de talento</h2>
                            <span className="tr-bloque-fase">Fase 1</span>
                        </div>
                        {!fase0Cerrada && (
                            <div className="tr-aviso">
                                <span className="material-symbols-outlined">info</span>
                                Esta etapa se apoya en la información de la Fase 0. Te recomendamos cerrar primero las evaluaciones y los objetivos.
                            </div>
                        )}
                        <ul className="tr-lista">
                            <TareaItem
                                icono="trending_up"
                                titulo="Guía de Potencial"
                                descripcion={descripcionCiclo(lider.guia_potencial.ciclo)}
                                estado={lider.guia_potencial.ciclo ? estadoPorProgreso(lider.guia_potencial) : 'sin_ciclo'}
                                progreso={lider.guia_potencial}
                                accion={{ label: 'Completar', onClick: () => navigate('/rrhh-formularios'), disabled: !lider.guia_potencial.ciclo }}
                            />
                            <TareaItem
                                icono="crisis_alert"
                                titulo="Riesgo e Impacto de Pérdida"
                                descripcion={descripcionCiclo(lider.riesgo_impacto.ciclo)}
                                estado={lider.riesgo_impacto.ciclo ? estadoPorProgreso(lider.riesgo_impacto) : 'sin_ciclo'}
                                progreso={lider.riesgo_impacto}
                                accion={{ label: 'Completar', onClick: () => navigate('/rrhh-formularios'), disabled: !lider.riesgo_impacto.ciclo }}
                            />
                            <TareaItem
                                icono="grid_3x3"
                                titulo="Matriz 9-Box"
                                descripcion={lider.nuevebox.habilitado
                                    ? registro9box
                                        ? `Registro "${registro9box.nombre}" en estado ${registro9box.estado}.`
                                        : 'Ya podés posicionar a tu equipo en el 9-box borrador.'
                                    : `Se habilita al finalizar la Guía de Potencial y Riesgo e Impacto de todo tu equipo. ${lider.nuevebox.motivo}`}
                                estado={estado9box}
                                progreso={lider.nuevebox.elegibles > 0 ? { total: lider.nuevebox.elegibles, completos: lider.nuevebox.completos } : null}
                                accion={{
                                    label: registro9box ? 'Abrir 9-Box' : 'Armar 9-Box',
                                    onClick: () => navigate('/nueve-box'),
                                    disabled: !lider.nuevebox.habilitado && !registro9box,
                                }}
                            />
                        </ul>
                    </section>

                    {lider.equipo.length > 0 && (
                        <section className="tr-bloque">
                            <div className="tr-bloque-head">
                                <h2>Estado por colaborador</h2>
                                <span className="tr-bloque-fase">{lider.equipo.length} reportes directos</span>
                            </div>
                            <EquipoTabla equipo={lider.equipo} />
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
