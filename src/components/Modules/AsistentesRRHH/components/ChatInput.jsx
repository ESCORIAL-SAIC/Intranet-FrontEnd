import { useState, useRef } from 'react';

function ChatInput({ onEnviar, disabled }) {
    const [texto, setTexto] = useState('');
    const [archivos, setArchivos] = useState([]);
    const fileInputRef = useRef(null);

    const agregarArchivos = (e) => {
        const nuevos = Array.from(e.target.files || []);
        setArchivos(prev => [...prev, ...nuevos]);
        e.target.value = '';
    };

    const quitarArchivo = (idx) => {
        setArchivos(prev => prev.filter((_, i) => i !== idx));
    };

    const enviar = () => {
        if (disabled) return;
        if (!texto.trim() && archivos.length === 0) return;
        onEnviar(texto, archivos);
        setTexto('');
        setArchivos([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviar();
        }
    };

    return (
        <div className="arh-chat-input">
            {archivos.length > 0 && (
                <div className="arh-pendientes">
                    {archivos.map((f, idx) => (
                        <span key={idx} className="arh-pendiente-chip">
                            <i className="material-symbols-outlined">description</i>
                            {f.name}
                            <i className="material-symbols-outlined arh-pendiente-quitar" onClick={() => quitarArchivo(idx)}>close</i>
                        </span>
                    ))}
                </div>
            )}
            <div className="arh-chat-input-row">
                <button
                    className="arh-btn-adjuntar"
                    title="Adjuntar PDF"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                >
                    <i className="material-symbols-outlined">attach_file</i>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    style={{ display: 'none' }}
                    onChange={agregarArchivos}
                />
                <textarea
                    className="arh-textarea"
                    placeholder="Escribí tu mensaje..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={2}
                />
                <button className="arh-btn-enviar" onClick={enviar} disabled={disabled}>
                    <i className="material-symbols-outlined">send</i>
                </button>
            </div>
        </div>
    );
}

export default ChatInput;
