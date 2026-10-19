import { useState } from 'react';
import { ESTADOS_ROADMAP, TIPOS_INDUCCION, EVALUACIONES, ESTADOS_ENCUESTA_1MES } from '../constants';
import { fmt, fmtFecha, fmtFechaHora } from '../utils';

// Tablero de gestión de inducciones (ref. info-prompts/RRHHInduccion/Inducción - Tablero de Gestión.html):
// indicadores (clickeables, filtran la tabla), buscador, filtros y listado de roadmaps.

function EstadoRoadmap({ estado }) {
    const info = ESTADOS_ROADMAP[estado] || { label: estado, className: '' };
    return <span className={`ri-chip ${info.className}`}>{info.label}</span>;
}

function ProximoPendiente({ pendiente }) {
    if (!pendiente) return <span className="ri-tabla-sub">—</span>;
    if (pendiente.tipo === 'evaluacion') {
        const evaluacion = EVALUACIONES[pendiente.evaluacion_tipo];
        return (
            <div>
                <div className="ri-pendiente">Evaluación: {evaluacion ? evaluacion.label : pendiente.evaluacion_tipo}</div>
                <div className="ri-tabla-sub">De la inducción {pendiente.nombre}</div>
            </div>
        );
    }
    return (
        <div>
            <div className="ri-pendiente">{pendiente.nombre}</div>
            {pendiente.tipo === 'induccion' && (
                <div className={`ri-tabla-sub ${pendiente.atrasada ? 'ri-texto-alerta' : ''}`}>
                    {pendiente.fecha ? `${fmtFecha(pendiente.fecha)}${pendiente.horario ? ` · ${pendiente.horario} hs` : ''}` : 'Fecha a confirmar'}
                    {pendiente.atrasada && ' · Atrasada'}
                </div>
            )}
        </div>
    );
}

function Encuesta1Mes({ encuesta }) {
    const info = ESTADOS_ENCUESTA_1MES[encuesta.estado];
    return (
        <div>
            <span className={`ri-chip ${info.className}`}>{info.label}</span>
            <div className="ri-tabla-sub">
                {encuesta.estado === 'completada'
                    ? `Respondida ${fmtFechaHora(encuesta.fecha)}`
                    : encuesta.disponible_desde && `Disponible desde ${fmtFecha(encuesta.disponible_desde)}`}
            </div>
        </div>
    );
}

function esDelMesActual(timestamp) {
    if (!timestamp) return false;
    const fecha = new Date(timestamp);
    const hoy = new Date();
    return fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === hoy.getMonth();
}

// Cada indicador es un filtro rápido sobre el listado.
const INDICADORES = [
    { clave: 'en_curso', label: 'Inducciones en curso', variante: '',
      filtro: r => r.estado === 'publicado' },
    { clave: 'con_pendientes', label: 'Con actividades pendientes', variante: 'warning',
      ayuda: 'En curso, con inducciones atrasadas o evaluaciones sin realizar',
      filtro: r => r.estado === 'publicado' && (r.actividades_atrasadas > 0 || r.evaluaciones_pendientes > 0) },
    { clave: 'finalizadas_mes', label: 'Finalizadas este mes', variante: 'success',
      filtro: r => r.estado === 'finalizado' && esDelMesActual(r.fecha_finalizacion) },
    { clave: 'jefaturas', label: 'Jefaturas / Gerencias', variante: 'neutral',
      ayuda: 'Inducciones en curso de tipo Jefatura / Gerencia',
      filtro: r => r.estado === 'publicado' && r.tipo === 'jefatura' },
    { clave: 'encuestas_1mes', label: 'Encuestas 1.er mes pendientes', variante: 'warning',
      filtro: r => r.encuesta_1mes.estado === 'pendiente' },
];

function ListadoRoadmaps({ roadmaps, cargando, onVer, onNuevo }) {
    const [busqueda, setBusqueda] = useState('');
    const [estado, setEstado] = useState('todos');
    const [tipo, setTipo] = useState('todos');
    const [indicador, setIndicador] = useState(null);

    const labelTipo = (valor) => (TIPOS_INDUCCION.find(t => t.value === valor) || {}).label || valor;

    const texto = busqueda.trim().toLowerCase();
    const filtroIndicador = INDICADORES.find(i => i.clave === indicador);
    const filtrados = roadmaps.filter(r =>
        (!texto || [r.nombre_snapshot, r.puesto_snapshot, r.tutor_rrhh, r.legajo_snapshot]
            .some(v => String(v || '').toLowerCase().includes(texto)))
        && (estado === 'todos' || r.estado === estado)
        && (tipo === 'todos' || r.tipo === tipo)
        && (!filtroIndicador || filtroIndicador.filtro(r))
    );

    const limpiarFiltros = () => {
        setBusqueda('');
        setEstado('todos');
        setTipo('todos');
        setIndicador(null);
    };
    const hayFiltros = texto || estado !== 'todos' || tipo !== 'todos' || indicador;

    return (
        <div>
            <section className="ri-indicadores">
                {INDICADORES.map(i => (
                    <button key={i.clave} type="button" title={i.ayuda || i.label}
                            className={`ri-indicador ${i.variante} ${indicador === i.clave ? 'activo' : ''}`}
                            onClick={() => setIndicador(indicador === i.clave ? null : i.clave)}>
                        <div className="ri-indicador-numero">{roadmaps.filter(i.filtro).length}</div>
                        <div className="ri-indicador-label">{i.label}</div>
                    </button>
                ))}
            </section>

            <div className="ri-toolbar ri-toolbar-filtros">
                <input className="ri-input" placeholder="Buscar por colaborador, puesto, legajo o tutor..."
                       value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <select className="ri-input" value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="todos">Todos los estados</option>
                    {Object.entries(ESTADOS_ROADMAP).map(([valor, info]) => (
                        <option key={valor} value={valor}>{info.label}</option>
                    ))}
                </select>
                <select className="ri-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="todos">Todos los tipos</option>
                    {TIPOS_INDUCCION.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {hayFiltros && <button type="button" className="ri-boton" onClick={limpiarFiltros}>Limpiar</button>}
                <button type="button" className="ri-boton-primario" onClick={onNuevo}>
                    <i className="material-symbols-outlined">add</i> Nuevo roadmap
                </button>
            </div>

            {filtroIndicador && (
                <div className="ri-info ri-filtro-activo">
                    Mostrando: <strong>{filtroIndicador.label}</strong>
                    {filtroIndicador.ayuda && <> — {filtroIndicador.ayuda.toLowerCase()}</>}
                </div>
            )}

            {cargando ? (
                <div className="ri-vacio">Cargando roadmaps...</div>
            ) : roadmaps.length === 0 ? (
                <div className="ri-vacio">Todavía no se creó ningún roadmap de inducción.</div>
            ) : filtrados.length === 0 ? (
                <div className="ri-vacio">No hay inducciones que coincidan con los filtros.</div>
            ) : (
                <div className="ri-tabla-wrap">
                    <table className="ri-tabla">
                        <thead>
                            <tr>
                                <th>Colaborador</th>
                                <th>Tipo</th>
                                <th>Ingreso</th>
                                <th>Tutor RRHH</th>
                                <th>Avance</th>
                                <th>Estado</th>
                                <th>Próximo pendiente</th>
                                <th>Encuesta 1.er mes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(r => (
                                <tr key={r.id} className="ri-tabla-fila" onClick={() => onVer(r.id)}>
                                    <td>
                                        <div className="ri-pendiente">{fmt(r.nombre_snapshot)}</div>
                                        <div className="ri-tabla-sub">{fmt(r.puesto_snapshot)} · Legajo {fmt(r.legajo_snapshot)}</div>
                                    </td>
                                    <td><span className={`ri-chip tipo-${r.tipo}`}>{labelTipo(r.tipo)}</span></td>
                                    <td>{fmtFecha(r.fecha_ingreso)}</td>
                                    <td>{fmt(r.tutor_rrhh)}</td>
                                    <td>
                                        <div className="ri-mini-barra">
                                            <div style={{ width: `${r.progreso.porcentaje}%` }}></div>
                                        </div>
                                        <div className="ri-tabla-sub">{r.progreso.completadas} de {r.progreso.total} · {r.progreso.porcentaje}%</div>
                                    </td>
                                    <td><EstadoRoadmap estado={r.estado} /></td>
                                    <td><ProximoPendiente pendiente={r.proximo_pendiente} /></td>
                                    <td><Encuesta1Mes encuesta={r.encuesta_1mes} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export { EstadoRoadmap, ProximoPendiente };
export default ListadoRoadmaps;
