import { ESTADOS } from '../constants';

function EstadoBadge({ estado }) {
    const info = ESTADOS[estado] || { label: estado, className: '' };
    return <span className={`rf-estado-badge ${info.className}`}>{info.label}</span>;
}

export default EstadoBadge;
