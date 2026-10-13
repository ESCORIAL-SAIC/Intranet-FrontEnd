import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

// Buscador de empleados activos (tabla empleado) con autocompletado. Solo permite elegir un
// empleado de la lista; el valor seleccionado es el nombre (value / onChange(nombre)).
function SelectorEmpleado({ value, onChange, placeholder = 'Buscar empleado...' }) {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');

    const [texto, setTexto] = useState('');
    const [resultados, setResultados] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const ultimaBusqueda = useRef('');

    useEffect(() => {
        const consulta = texto.trim();
        ultimaBusqueda.current = consulta;
        if (consulta.length < 2) {
            setResultados([]);
            return;
        }
        // Debounce: espera a que el usuario deje de tipear antes de consultar.
        const timer = setTimeout(async () => {
            setBuscando(true);
            try {
                const response = await axios.get(`${baseURL}/induccion/empleados/buscar`, {
                    headers: { Authorization: token },
                    params: { q: consulta },
                });
                // Descarta respuestas de búsquedas que ya no son la última.
                if (ultimaBusqueda.current === consulta) setResultados(response.data.empleados);
            } catch (err) {
                console.log(err);
            }
            setBuscando(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [texto]);

    const seleccionar = (empleado) => {
        onChange(empleado.nombre);
        setTexto('');
        setResultados([]);
        setAbierto(false);
    };

    if (value) {
        return (
            <div className="ri-selector-elegido">
                <i className="material-symbols-outlined">person</i>
                <span title={value}>{value}</span>
                <button type="button" className="ri-boton-icono" title="Cambiar" onClick={() => onChange('')}>
                    <i className="material-symbols-outlined">close</i>
                </button>
            </div>
        );
    }

    const consultaValida = texto.trim().length >= 2;

    return (
        <div className="ri-selector">
            <input className="ri-input" placeholder={placeholder} value={texto}
                   onChange={(e) => { setTexto(e.target.value); setAbierto(true); }}
                   onFocus={() => setAbierto(true)}
                   onBlur={() => setAbierto(false)} />
            {abierto && consultaValida && (
                <ul className="ri-selector-lista">
                    {buscando && resultados.length === 0 && <li className="ri-selector-vacio">Buscando...</li>}
                    {!buscando && resultados.length === 0 && <li className="ri-selector-vacio">Sin resultados</li>}
                    {resultados.map(e => (
                        // onMouseDown (no onClick) para seleccionar antes de que el blur cierre la lista.
                        <li key={e.id} onMouseDown={(ev) => { ev.preventDefault(); seleccionar(e); }}>
                            <div className="ri-selector-nombre">{e.nombre}</div>
                            <div className="ri-selector-sub">
                                {[e.puesto, e.sector, e.legajo && `Legajo ${e.legajo}`].filter(Boolean).join(' · ')}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SelectorEmpleado;
