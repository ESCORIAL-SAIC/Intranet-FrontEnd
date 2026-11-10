import axios from 'axios';
import { useEffect, useState } from 'react';

// Sala de Microsoft 365 para la reunión de Teams de una inducción, con su disponibilidad en el
// horario elegido. Las salas ocupadas no se pueden elegir; si la elegida se ocupa antes de guardar,
// el backend crea la reunión solo por Teams.
function SelectorSala({ item, onChange }) {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');

    const [salas, setSalas] = useState([]);
    const [consultando, setConsultando] = useState(false);
    const [error, setError] = useState(null);

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

    return (
        <div>
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
            {!consultando && !tieneHorario && <div className="ri-nota">Cargá fecha y horario para ver qué salas están libres.</div>}
            {!consultando && elegida && elegida.disponible === false && (
                <div className="ri-nota ri-texto-alerta">Ocupada en ese horario: la reunión se creará solo por Teams.</div>
            )}
            {error && <div className="ri-nota ri-texto-alerta">{error}</div>}
        </div>
    );
}

export default SelectorSala;
