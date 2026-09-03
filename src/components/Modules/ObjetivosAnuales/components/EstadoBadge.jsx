import { ESTADOS } from '../constants';

function EstadoBadge({ estado }) {
    const info = ESTADOS[estado] || { label: estado, className: '' };
    return <span className={`oa-estado-badge ${info.className}`}>{info.label}</span>;
}

export default EstadoBadge;
