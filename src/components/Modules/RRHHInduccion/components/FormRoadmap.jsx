import { useState } from 'react';
import { TIPOS_INDUCCION, PLANTAS } from '../constants';
import InduccionConfig from './InduccionConfig';
import InfoUtil from './InfoUtil';
import ProgresoInduccion from './ProgresoInduccion';
import RoadmapTimeline from './RoadmapTimeline';

let contadorClaves = 0;
const nuevaClave = () => `nuevo-${++contadorClaves}`;

function itemDesdeCatalogo(c) {
    return {
        key: nuevaClave(),
        catalogo_id: c.id,
        nombre: c.nombre,
        fecha: '',
        horario: '',
        duracion_min: c.duracion_min,
        ubicacion: '',
        facilitador: '',
        material_url: c.material_url || '',
        requiere_evaluacion: c.requiere_evaluacion,
        evaluacion_url: c.evaluacion_url || '',
        observaciones: '',
        completada: false,
    };
}

function itemDesdeRoadmap(i) {
    return { ...i, key: i.id };
}

// Alta (a partir de un empleado seleccionado) y edición de un roadmap.
// Secciones: 1. Datos del colaborador, 2. Tipo, 3. Inducciones, 4. Información útil.
function FormRoadmap({ empleado, roadmap, catalogo, guardando, onGuardar, onCancelar }) {
    const generales = catalogo.filter(c => c.categoria === 'general');
    const especificas = catalogo.filter(c => c.categoria === 'especifica');
    const categoriaPorId = Object.fromEntries(catalogo.map(c => [c.id, c.categoria]));

    const [datos, setDatos] = useState(() => roadmap ? {
        nombre: roadmap.nombre_snapshot,
        legajo: roadmap.legajo_snapshot,
        puesto: roadmap.puesto_snapshot,
        sector: roadmap.sector || '',
        planta: roadmap.planta || PLANTAS[0],
        fecha_ingreso: roadmap.fecha_ingreso || '',
        jefe_directo: roadmap.jefe_directo || '',
        tutor_rrhh: roadmap.tutor_rrhh || '',
    } : {
        nombre: empleado.nombre,
        legajo: empleado.legajo,
        puesto: empleado.puesto,
        sector: empleado.sector || '',
        planta: PLANTAS[0],
        fecha_ingreso: empleado.fecha_ingreso || '',
        jefe_directo: empleado.jefe_directo || '',
        tutor_rrhh: '',
    });
    const [tipo, setTipo] = useState(roadmap ? roadmap.tipo : 'estandar');
    const [items, setItems] = useState(() => roadmap
        ? roadmap.items.map(itemDesdeRoadmap)
        : generales.map(itemDesdeCatalogo));
    const [infoUtil, setInfoUtil] = useState(roadmap ? roadmap.info_util : {});
    const [agregarId, setAgregarId] = useState('');
    const [nombreNueva, setNombreNueva] = useState('');
    const [arrastrable, setArrastrable] = useState(null);
    const [arrastrando, setArrastrando] = useState(null);

    const yaPublicado = roadmap && roadmap.estado !== 'borrador';
    const setDato = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

    const cambiarTipo = (nuevoTipo) => {
        setTipo(nuevoTipo);
        // Al volver a Estándar se quitan las inducciones específicas del catálogo.
        if (nuevoTipo === 'estandar') {
            setItems(items.filter(i => categoriaPorId[i.catalogo_id] !== 'especifica'));
        }
    };

    const actualizarItem = (index, item) => setItems(items.map((i, idx) => idx === index ? item : i));
    const quitarItem = (index) => setItems(items.filter((_, idx) => idx !== index));
    const moverItem = (desde, hasta) => {
        if (hasta < 0 || hasta >= items.length || desde === hasta) return;
        const copia = [...items];
        const [movido] = copia.splice(desde, 1);
        copia.splice(hasta, 0, movido);
        setItems(copia);
    };

    const disponibles = [...generales, ...(tipo === 'jefatura' ? especificas : [])]
        .filter(c => !items.some(i => i.catalogo_id === c.id));

    const agregarDesdeCatalogo = () => {
        const c = catalogo.find(x => x.id === agregarId);
        if (!c) return;
        setItems([...items, itemDesdeCatalogo(c)]);
        setAgregarId('');
    };

    const agregarPersonalizada = () => {
        const nombre = nombreNueva.trim();
        if (!nombre) return;
        setItems([...items, itemDesdeCatalogo({ id: null, nombre, duracion_min: 30, requiere_evaluacion: false })]);
        setNombreNueva('');
    };

    const guardar = (estado) => {
        const payload = {
            empleado_id: roadmap ? roadmap.empleado_id : empleado.id,
            tipo,
            sector: datos.sector,
            planta: datos.planta,
            fecha_ingreso: datos.fecha_ingreso || null,
            jefe_directo: datos.jefe_directo,
            tutor_rrhh: datos.tutor_rrhh,
            info_util: infoUtil,
            estado,
            items: items.map(({ key, ...resto }) => resto),
        };
        onGuardar(payload);
    };

    const progreso = {
        total: items.length + 1,
        completadas: items.filter(i => i.completada).length + (roadmap && roadmap.encuesta_completada ? 1 : 0),
    };
    progreso.porcentaje = Math.round((progreso.completadas / progreso.total) * 100);

    const faltanFechas = items.some(i => !i.fecha || !i.horario);

    return (
        <div className="ri-form">
            <ProgresoInduccion progreso={progreso} estado={roadmap ? roadmap.estado : 'borrador'} />

            <section className="ri-card">
                <div className="ri-card-titulo">1. Datos del colaborador</div>
                <div className="ri-grid">
                    <div>
                        <label className="ri-label">Nombre y apellido</label>
                        <input className="ri-input" value={datos.nombre || ''} readOnly />
                    </div>
                    <div>
                        <label className="ri-label">Legajo</label>
                        <input className="ri-input" value={datos.legajo || ''} readOnly />
                    </div>
                    <div>
                        <label className="ri-label">Puesto</label>
                        <input className="ri-input" value={datos.puesto || ''} readOnly />
                    </div>
                    <div>
                        <label className="ri-label">Sector</label>
                        <input className="ri-input" placeholder="Completar" value={datos.sector} onChange={setDato('sector')} />
                    </div>
                    <div>
                        <label className="ri-label">Planta</label>
                        <select className="ri-input" value={datos.planta} onChange={setDato('planta')}>
                            {PLANTAS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="ri-label">Fecha de ingreso</label>
                        <input className="ri-input" type="date" value={datos.fecha_ingreso} onChange={setDato('fecha_ingreso')} />
                    </div>
                    <div>
                        <label className="ri-label">Jefe directo</label>
                        <input className="ri-input" value={datos.jefe_directo} onChange={setDato('jefe_directo')} />
                    </div>
                    <div>
                        <label className="ri-label">Tutor RRHH</label>
                        <input className="ri-input" placeholder="Nombre del tutor" value={datos.tutor_rrhh} onChange={setDato('tutor_rrhh')} />
                    </div>
                </div>
            </section>

            <section className="ri-card">
                <div className="ri-card-titulo">2. Tipo de inducción</div>
                <div className="ri-tipos">
                    {TIPOS_INDUCCION.map(t => (
                        <label key={t.value} className={`ri-tipo ${tipo === t.value ? 'active' : ''}`}>
                            <input type="radio" name="tipo-induccion" checked={tipo === t.value} onChange={() => cambiarTipo(t.value)} />
                            <strong>{t.label}</strong>
                            <small>{t.descripcion}</small>
                        </label>
                    ))}
                </div>
                <div className="ri-info">
                    El checklist se genera a partir del tipo seleccionado y puede ser personalizado por RRHH antes de su publicación.
                </div>
            </section>

            <section className="ri-card">
                <div className="ri-card-titulo">3. Configurar inducciones</div>

                {items.map((item, index) => (
                    <InduccionConfig
                        key={item.key}
                        item={item}
                        index={index}
                        esPrimera={index === 0}
                        esUltima={index === items.length - 1}
                        onChange={(nuevo) => actualizarItem(index, nuevo)}
                        onQuitar={() => quitarItem(index)}
                        onSubir={() => moverItem(index, index - 1)}
                        onBajar={() => moverItem(index, index + 1)}
                        onAgarrar={() => setArrastrable(item.key)}
                        drag={{
                            draggable: arrastrable === item.key,
                            onDragStart: () => setArrastrando(index),
                            onDragOver: (e) => e.preventDefault(),
                            onDrop: (e) => { e.preventDefault(); if (arrastrando !== null) moverItem(arrastrando, index); },
                            onDragEnd: () => { setArrastrando(null); setArrastrable(null); },
                            onMouseUp: () => setArrastrable(null),
                        }}
                    />
                ))}

                <div className="ri-agregar">
                    <div className="ri-agregar-fila">
                        <select className="ri-input" value={agregarId} onChange={(e) => setAgregarId(e.target.value)}>
                            <option value="">Agregar desde el catálogo...</option>
                            {disponibles.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}{c.categoria === 'especifica' ? ' (específica)' : ''}
                                </option>
                            ))}
                        </select>
                        <button type="button" className="ri-boton-secundario" disabled={!agregarId} onClick={agregarDesdeCatalogo}>＋ Agregar</button>
                    </div>
                    <div className="ri-agregar-fila">
                        <input className="ri-input" placeholder="Nombre de una nueva inducción" value={nombreNueva}
                               onChange={(e) => setNombreNueva(e.target.value)}
                               onKeyDown={(e) => { if (e.key === 'Enter') agregarPersonalizada(); }} />
                        <button type="button" className="ri-boton-secundario" disabled={!nombreNueva.trim()} onClick={agregarPersonalizada}>＋ Agregar inducción</button>
                    </div>
                </div>

                <div className="ri-info">
                    Podés modificar el orden, fecha, horario, ubicación y facilitador. También podés quitar inducciones o agregar otras según corresponda.
                </div>

                <div className="ri-encuesta-card">
                    <div className="ri-encuesta-icono">✓</div>
                    <div>
                        <div className="ri-encuesta-titulo">Encuesta de satisfacción</div>
                        <div className="ri-encuesta-texto">Se incorpora automáticamente al final del recorrido y deberá ser completada por el colaborador para finalizar el proceso.</div>
                        <div className="ri-encuesta-estado">Estado: <strong>{roadmap && roadmap.encuesta_completada ? 'Completada' : 'Pendiente'}</strong></div>
                    </div>
                </div>

                <div className="ri-card-titulo ri-mt">Vista previa del roadmap</div>
                {items.length === 0
                    ? <div className="ri-vacio">Agregá al menos una inducción.</div>
                    : <RoadmapTimeline items={items.map((i, idx) => ({ ...i, id: i.key, orden: idx + 1 }))}
                                       encuestaCompletada={roadmap && roadmap.encuesta_completada}
                                       encuestaFecha={roadmap && roadmap.encuesta_fecha} />}

                <div className="ri-card-titulo ri-mt">4. Información útil</div>
                <InfoUtil infoUtil={infoUtil} onChange={setInfoUtil} />

                {faltanFechas && (
                    <div className="ri-alerta">Para publicar, todas las inducciones deben tener fecha y horario.</div>
                )}

                <div className="ri-acciones">
                    <button type="button" className="ri-boton" disabled={guardando} onClick={onCancelar}>Cancelar</button>
                    {!yaPublicado && (
                        <button type="button" className="ri-boton" disabled={guardando || items.length === 0} onClick={() => guardar('borrador')}>
                            Guardar borrador
                        </button>
                    )}
                    <button type="button" className="ri-boton-primario" disabled={guardando || items.length === 0 || faltanFechas} onClick={() => guardar('publicado')}>
                        {yaPublicado ? 'Guardar cambios' : 'Publicar checklist'}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default FormRoadmap;
