import { INFO_UTIL_LINKS, CONTACTOS_IMPORTANTES } from '../constants';

// Sección "Información útil". Si se pasa onChange (vista RRHH), las credenciales del
// comedor son editables; si no, se muestran al colaborador.
function InfoUtil({ infoUtil, onChange }) {
    const info = infoUtil || {};
    const tieneCredenciales = info.comedor_usuario || info.comedor_password;

    return (
        <div className="ri-info-util">
            <div className="ri-info-card">
                <h3>🍴 Servicio de comedor</h3>
                <p><a href={INFO_UTIL_LINKS.foodService} target="_blank" rel="noreferrer">👉 Ingresar al portal de Food Service</a></p>
                {onChange ? (
                    <div className="ri-info-credenciales-form">
                        <label className="ri-label">Usuario</label>
                        <input className="ri-input" value={info.comedor_usuario || ''}
                               onChange={(e) => onChange({ ...info, comedor_usuario: e.target.value })}
                               placeholder="ej. usuario@escorial.com.ar" />
                        <label className="ri-label">Contraseña</label>
                        <input className="ri-input" value={info.comedor_password || ''}
                               onChange={(e) => onChange({ ...info, comedor_password: e.target.value })}
                               placeholder="Contraseña inicial" />
                    </div>
                ) : tieneCredenciales && (
                    <div className="ri-info-credenciales">
                        <strong>Usuario:</strong> {info.comedor_usuario || '—'}<br />
                        <strong>Contraseña:</strong> {info.comedor_password || '—'}
                    </div>
                )}
                <p>📑 <a href={INFO_UTIL_LINKS.foodServiceInstructivo} target="_blank" rel="noreferrer">Ver instructivo</a></p>
                <p>Ya podés ingresar y elegir tu menú.</p>
            </div>

            <div className="ri-info-card">
                <h3>🛒 Club de Beneficios</h3>
                <p>
                    <a href={INFO_UTIL_LINKS.clubBeneficios} target="_blank" rel="noreferrer">Registrate en Club de Beneficios</a> y
                    comenzá a disfrutar de todos los descuentos disponibles.
                </p>
            </div>

            <div className="ri-info-card">
                <h3>📲 Contactos importantes</h3>
                <ul>
                    {CONTACTOS_IMPORTANTES.map(c => (
                        <li key={c.label}>{c.label}: <strong>{c.valor}</strong></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default InfoUtil;
