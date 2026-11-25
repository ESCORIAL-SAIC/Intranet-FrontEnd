import { ESTADOS } from '../constants';

export default function EstadoChip({ estado }) {
    const meta = ESTADOS[estado] || { label: estado, tono: 'off' };
    return <span className={`tr-chip tr-chip-${meta.tono}`}>{meta.label}</span>;
}
