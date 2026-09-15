import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageBubble({ mensaje }) {
    const esUsuario = mensaje.rol === 'user';

    return (
        <div className={`arh-msg ${esUsuario ? 'arh-msg-user' : 'arh-msg-assistant'}`}>
            <div className="arh-msg-bubble">
                {esUsuario ? (
                    <div className="arh-msg-texto">{mensaje.contenido}</div>
                ) : (
                    <div className="arh-msg-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mensaje.contenido || ''}</ReactMarkdown>
                    </div>
                )}
                {mensaje.archivos && mensaje.archivos.length > 0 && (
                    <div className="arh-msg-archivos">
                        {mensaje.archivos.map((a, idx) => (
                            <span key={idx} className="arh-msg-archivo-chip">
                                <i className="material-symbols-outlined">description</i>
                                {a.nombre_archivo}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageBubble;
