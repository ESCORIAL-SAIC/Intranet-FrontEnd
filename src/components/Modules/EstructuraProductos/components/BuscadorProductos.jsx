import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Resaltado({ texto, q }) {
    if (!texto) return null;
    if (!q) return texto;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return texto.split(re).map((parte, i) =>
        i % 2 === 1 ? <mark key={i}>{parte}</mark> : parte
    );
}

// Input con autocompletado de productos terminados. Al hacer foco lista los primeros sin filtro.
function BuscadorProductos({ baseURL, axiosConfig, valor, setValor, onSeleccionar, onLimpiar }) {
    const [sugerencias, setSugerencias] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const [consulta, setConsulta] = useState('');
    const debounce = useRef(null);
    const ultimaConsulta = useRef(0);
    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const listaRef = useRef(null);

    useEffect(() => {
        const cerrar = (e) => { if (!wrapRef.current?.contains(e.target)) setAbierto(false); };
        document.addEventListener('click', cerrar);
        return () => {
            document.removeEventListener('click', cerrar);
            clearTimeout(debounce.current);
        };
    }, []);

    const buscarSugerencias = async (q) => {
        const n = ++ultimaConsulta.current;
        try {
            const response = await axios.get(`${baseURL}/estructura-productos/productos`, { ...axiosConfig, params: { q } });
            if (n !== ultimaConsulta.current) return; // llegó tarde: ya hay una búsqueda más nueva
            setSugerencias(response.data);
            setConsulta(q);
            setAbierto(response.data.length > 0);
        } catch (err) {
            console.log(err);
        }
    };

    const onFocus = () => {
        if (valor.trim().length < 2) buscarSugerencias('');
        else if (sugerencias.length) setAbierto(true);
    };

    const onChange = (e) => {
        const v = e.target.value;
        setValor(v);
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => buscarSugerencias(v.trim()), 250);
    };

    const elegir = (prod) => {
        setAbierto(false);
        onSeleccionar(prod.codigo, prod.descripcion);
    };

    const onKeyDownInput = (e) => {
        if (e.key === 'Enter') { setAbierto(false); onSeleccionar(valor.trim()); }
        if (e.key === 'Escape') setAbierto(false);
        if (e.key === 'ArrowDown') { e.preventDefault(); listaRef.current?.querySelector('.ep-dd-item')?.focus(); }
    };

    const onKeyDownLista = (e) => {
        const items = [...listaRef.current.querySelectorAll('.ep-dd-item')];
        const idx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(idx + 1, items.length - 1)]?.focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); idx > 0 ? items[idx - 1].focus() : inputRef.current.focus(); }
        if (e.key === 'Enter') { e.preventDefault(); document.activeElement.click(); }
        if (e.key === 'Escape') { setAbierto(false); inputRef.current.focus(); }
    };

    return (
        <div className="ep-search-wrap" ref={wrapRef}>
            <input
                ref={inputRef}
                type="text"
                className="ep-search-inp"
                placeholder="Clic para ver productos o escribí para filtrar…"
                autoComplete="off"
                spellCheck="false"
                value={valor}
                onChange={onChange}
                onFocus={onFocus}
                onKeyDown={onKeyDownInput}
            />
            {valor && (
                <button className="ep-search-clear" onClick={() => { setAbierto(false); onLimpiar(); }} title="Limpiar">✕</button>
            )}
            {abierto && (
                <div className="ep-dropdown" ref={listaRef} onKeyDown={onKeyDownLista}>
                    {sugerencias.map(prod => (
                        <div key={prod.codigo} className="ep-dd-item" tabIndex={0} onClick={() => elegir(prod)}>
                            <div className="ep-dd-code"><Resaltado texto={prod.codigo} q={consulta} /></div>
                            <div className="ep-dd-desc"><Resaltado texto={prod.descripcion} q={consulta} /></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BuscadorProductos;
