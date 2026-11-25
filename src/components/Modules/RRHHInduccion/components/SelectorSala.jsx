import axios from 'axios';
import { useEffect, useState } from 'react';

// Sala de Microsoft 365 para la reunión de Teams de una inducción, con su disponibilidad en el
// horario elegido y la agenda del día de todas las salas. Las salas ocupadas no se pueden elegir;
// si la elegida se ocupa antes de guardar, el backend crea la reunión solo por Teams.
// Devuelve dos celdas de la grilla de InduccionConfig: el selector y la agenda (a todo el ancho).

const aMinutos = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};
const aHora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

// Une ocupaciones contiguas o superpuestas (09-11, 11-12 → 09-12) para que se lean como un bloque.
function unirOcupaciones(ocupaciones) {
    const unidas = [];
    for (const o of ocupaciones.map(x => ({ desde: aMinutos(x.inicio), hasta: aMinutos(x.fin) })).sort((a, b) => a.desde - b.desde)) {
        const ultima = unidas[unidas.length - 1];
        if (ultima && o.desde <= ultima.hasta) ultima.hasta = Math.max(ultima.hasta, o.hasta);
        else unidas.push({ ...o });
    }
    return unidas;
}

function AgendaSalas({ salas, item, onElegir }) {
    const tieneHorario = !!item.horario;
    const inicioInduccion = tieneHorario ? aMinutos(item.horario) : null;
    const finInduccion = tieneHorario ? Math.min(inicioInduccion + (parseInt(item.duracion_min, 10) || 30), 24 * 60) : null;

    // Ventana visible: 07 a 20 hs, ampliada si la inducción cae fuera de ese rango.
    const desde = Math.min(7 * 60, tieneHorario ? Math.floor(inicioInduccion / 60) * 60 : 7 * 60);
    const hasta = Math.max(20 * 60, tieneHorario ? Math.ceil(finInduccion / 60) * 60 : 20 * 60);
    const total = hasta - desde;
    const pos = (min) => `${((Math.min(Math.max(min, desde), hasta) - desde) / total) * 100}%`;
    const ancho = (a, b) => `${((Math.min(b, hasta) - Math.max(a, desde)) / total) * 100}%`;
    const horas = [];
    for (let m = desde; m <= hasta; m += 60) horas.push(m);

    return (
        <div className="ri-agenda">
            <div className="ri-agenda-fila ri-agenda-escala">
                <div className="ri-agenda-sala" />
                <div className="ri-agenda-pista">
                    {horas.map(m => (
                        <span key={m} className="ri-agenda-hora" style={{ left: pos(m) }}>{aHora(m).substring(0, 2)}</span>
                    ))}
                </div>
            </div>

            {salas.map(s => {
                const sinDatos = !s.ocupaciones;
                const elegida = s.email === item.sala_email;
                const bloqueada = s.disponible === false && !elegida;
                return (
                    <button type="button" key={s.email}
                            className={`ri-agenda-fila ${elegida ? 'elegida' : ''} ${bloqueada ? 'bloqueada' : ''}`}
                            disabled={bloqueada || sinDatos}
                            title={bloqueada ? 'Ocupada en el horario de la inducción' : sinDatos ? 'No se pudo consultar la agenda de esta sala' : 'Elegir esta sala'}
                            onClick={() => onElegir(elegida ? '' : s.email)}>
                        <div className="ri-agenda-sala">
                            <span className="ri-agenda-nombre">{s.nombre}</span>
                            <span className="ri-agenda-sub">
                                {s.capacidad ? `${s.capacidad} pers.` : ''}
                                {s.disponible === true && <span className="ri-agenda-libre"> · Libre</span>}
                                {s.disponible === false && <span className="ri-agenda-ocupada"> · Ocupada</span>}
                                {sinDatos && ' · Sin datos'}
                            </span>
                        </div>
                        <div className="ri-agenda-pista">
                            {horas.slice(1, -1).map(m => <span key={m} className="ri-agenda-linea" style={{ left: pos(m) }} />)}
                            {!sinDatos && unirOcupaciones(s.ocupaciones)
                                .filter(o => o.hasta > desde && o.desde < hasta)
                                .map(o => (
                                    <span key={o.desde} className="ri-agenda-ocupacion" style={{ left: pos(o.desde), width: ancho(o.desde, o.hasta) }}
                                          title={`Ocupada ${aHora(o.desde)} a ${aHora(o.hasta)}`} />
                                ))}
                            {tieneHorario && (
                                <span className={`ri-agenda-induccion ${s.disponible === false ? 'choca' : ''}`}
                                      style={{ left: pos(inicioInduccion), width: ancho(inicioInduccion, finInduccion) }}
                                      title={`Inducción ${aHora(inicioInduccion)} a ${aHora(finInduccion)}`} />
                            )}
                        </div>
                    </button>
                );
            })}

            <div className="ri-agenda-leyenda">
                <span><i className="ri-agenda-muestra ocupada" />Ocupada</span>
                {tieneHorario && <span><i className="ri-agenda-muestra induccion" />Horario de la inducción</span>}
                <span><i className="ri-agenda-muestra elegida" />Sala elegida</span>
                <span className="ri-agenda-ayuda">Hacé clic en una sala libre para elegirla.</span>
            </div>
        </div>
    );
}

function SelectorSala({ item, onChange }) {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');

    const [salas, setSalas] = useState([]);
    const [consultando, setConsultando] = useState(false);
    const [error, setError] = useState(null);
    const [verAgenda, setVerAgenda] = useState(true);

    const tieneHorario = !!(item.fecha && item.horario);

    useEffect(() => {
        // Debounce: espera a que RRHH termine de cargar fecha/horario/duración.
        const timer = setTimeout(async () => {
            setConsultando(true);
            setError(null);
            try {
                const response = await axios.get(`${baseURL}/induccion/salas/disponibilidad`, {
                    headers: { Authorization: token },
                    params: {
                        fecha: item.fecha || undefined,
                        horario: item.horario || undefined,
                        duracion: item.duracion_min,
                        item_id: item.id || undefined,
                    },
                });
                setSalas(response.data.salas);
            } catch (err) {
                console.log(err);
                setError((err.response && err.response.data && err.response.data.error) || 'No se pudo consultar la disponibilidad');
            }
            setConsultando(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [item.fecha, item.horario, item.duracion_min]);

    const elegida = salas.find(s => s.email === item.sala_email);
    const etiqueta = (s) => {
        const capacidad = s.capacidad ? ` · ${s.capacidad} pers.` : '';
        if (!tieneHorario || s.disponible === null) return `${s.nombre}${capacidad}`;
        return `${s.nombre}${capacidad} — ${s.disponible ? 'Disponible' : 'Ocupada'}`;
    };

    const seleccionar = (email) => {
        const sala = salas.find(s => s.email === email);
        onChange(sala
            ? { ...item, sala_email: sala.email, sala_nombre: sala.nombre, ubicacion: sala.nombre }
            : { ...item, sala_email: '', sala_nombre: '' });
    };

    const hayAgenda = !!item.fecha && salas.some(s => s.ocupaciones);

    return (
        <>
            <div>
                <label className="ri-label">Sala (reunión Teams)</label>
                <select className="ri-input" value={item.sala_email || ''} onChange={(e) => seleccionar(e.target.value)}>
                    <option value="">Sin sala (solo Teams)</option>
                    {/* La sala guardada se muestra aunque ya no esté en la lista de Microsoft 365. */}
                    {item.sala_email && !elegida && <option value={item.sala_email}>{item.sala_nombre || item.sala_email}</option>}
                    {salas.map(s => (
                        <option key={s.email} value={s.email} disabled={s.disponible === false && s.email !== item.sala_email}>
                            {etiqueta(s)}
                        </option>
                    ))}
                </select>
                {consultando && <div className="ri-nota">Consultando disponibilidad...</div>}
                {!consultando && !item.fecha && <div className="ri-nota">Cargá la fecha para ver la agenda de las salas.</div>}
                {!consultando && item.fecha && !item.horario && <div className="ri-nota">Cargá el horario para ver qué salas están libres.</div>}
                {!consultando && elegida && elegida.disponible === false && (
                    <div className="ri-nota ri-texto-alerta">Ocupada en ese horario: la reunión se creará solo por Teams.</div>
                )}
                {hayAgenda && (
                    <button type="button" className="ri-agenda-toggle" onClick={() => setVerAgenda(v => !v)}>
                        <i className="material-symbols-outlined">{verAgenda ? 'expand_less' : 'calendar_view_day'}</i>
                        {verAgenda ? 'Ocultar agenda del día' : 'Ver agenda del día'}
                    </button>
                )}
                {error && <div className="ri-nota ri-texto-alerta">{error}</div>}
            </div>
            {hayAgenda && verAgenda && <AgendaSalas salas={salas} item={item} onElegir={seleccionar} />}
        </>
    );
}

export default SelectorSala;
