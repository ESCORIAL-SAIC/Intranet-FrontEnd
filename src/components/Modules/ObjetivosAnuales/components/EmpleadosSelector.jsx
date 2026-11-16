import { useEffect, useRef, useState } from 'react';

// Buscador único con desplegable para elegir uno o varios empleados de la nómina.
// Cada empleado elegido queda como chip (se quita con la ×); la búsqueda se dispara al
// escribir 2 o más caracteres, con un pequeño debounce para no consultar por cada tecla.
function EmpleadosSelector({ seleccionados, onChange, buscar }) {
    const [texto, setTexto] = useState('');
    const [resultados, setResultados] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [resaltado, setResaltado] = useState(0);
    const contenedorRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const q = texto.trim();
        if (q.length < 2) { setResultados([]); setBuscando(false); return; }
        setBuscando(true);
        let vigente = true;
        const timer = setTimeout(async () => {
            const lista = await buscar(q);
            if (!vigente) return;
            setResultados(lista);
            setResaltado(0);
            setBuscando(false);
        }, 300);
        return () => { vigente = false; clearTimeout(timer); };
    }, [texto, buscar]);

    useEffect(() => {
        const cerrar = (e) => { if (contenedorRef.current && !contenedorRef.current.contains(e.target)) setAbierto(false); };
        document.addEventListener('mousedown', cerrar);
        return () => document.removeEventListener('mousedown', cerrar);
    }, []);

    const idsSeleccionados = new Set(seleccionados.map(s => s.empleado_id));
    const opciones = resultados.filter(r => !idsSeleccionados.has(r.empleado_id));

    const agregar = (emp) => {
        onChange([...seleccionados, emp]);
        setTexto('');
        setResultados([]);
        inputRef.current?.focus();
    };

    const quitar = (id) => onChange(seleccionados.filter(s => s.empleado_id !== id));

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setAbierto(true); setResaltado(i => Math.min(i + 1, opciones.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setResaltado(i => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter') {
            // Enter elige la opción resaltada en lugar de enviar el formulario
            if (abierto && opciones[resaltado]) { e.preventDefault(); agregar(opciones[resaltado]); }
            else if (texto) e.preventDefault();
        }
        else if (e.key === 'Escape') setAbierto(false);
        else if (e.key === 'Backspace' && !texto && seleccionados.length > 0) quitar(seleccionados[seleccionados.length - 1].empleado_id);
    };

    const q = texto.trim();
    const mostrarDesplegable = abierto && q.length >= 2;

    return (
        <div className="oa-emp-selector" ref={contenedorRef}>
            <div className="oa-emp-box" onClick={() => inputRef.current?.focus()}>
                {seleccionados.map(s => (
                    <span key={s.empleado_id} className="oa-emp-chip" title={s.puesto || ''}>
                        {s.empleado}
                        <button type="button" aria-label={`Quitar a ${s.empleado}`} onClick={(e) => { e.stopPropagation(); quitar(s.empleado_id); }}>×</button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    className="oa-emp-input"
                    type="text"
                    value={texto}
                    onChange={(e) => { setTexto(e.target.value); setAbierto(true); }}
                    onFocus={() => setAbierto(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={seleccionados.length ? 'Agregar otro empleado...' : 'Buscá por nombre o legajo...'}
                    role="combobox"
                    aria-expanded={mostrarDesplegable}
                    aria-controls="oa-emp-opciones"
                />
            </div>
            {mostrarDesplegable && (
                <ul className="oa-emp-opciones" id="oa-emp-opciones" role="listbox">
                    {buscando && opciones.length === 0 && <li className="oa-emp-info">Buscando...</li>}
                    {!buscando && opciones.length === 0 && <li className="oa-emp-info">Sin resultados para “{q}”</li>}
                    {opciones.map((emp, i) => (
                        <li
                            key={emp.empleado_id}
                            role="option"
                            aria-selected={i === resaltado}
                            className={i === resaltado ? 'resaltado' : ''}
                            onMouseEnter={() => setResaltado(i)}
                            onMouseDown={(e) => { e.preventDefault(); agregar(emp); }}
                        >
                            <span className="oa-emp-nombre">{emp.empleado}</span>
                            {emp.puesto && <span className="oa-emp-puesto">{emp.puesto}</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default EmpleadosSelector;
