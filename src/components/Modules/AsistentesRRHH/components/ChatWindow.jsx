import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function ChatWindow({ mensajes, loading, enviando }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes, enviando]);

    return (
        <div className="arh-chat-window">
            {loading && <div className="arh-sin-datos">Cargando conversación...</div>}

            {!loading && mensajes.length === 0 && (
                <div className="arh-chat-vacio">
                    Escribí tu primer mensaje o adjuntá un documento para empezar la conversación con este asistente.
                </div>
            )}

            {!loading && mensajes.map(m => <MessageBubble key={m.id} mensaje={m} />)}

            {enviando && (
                <div className="arh-msg arh-msg-assistant">
                    <div className="arh-msg-bubble arh-msg-pensando">Analizando...</div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}

export default ChatWindow;
