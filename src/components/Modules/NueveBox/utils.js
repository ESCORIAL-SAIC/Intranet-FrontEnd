import { BOX_MATRIX } from './constants';

export const bandForPerformance = (score) => {
  if (score < 1.6) return 'low';
  if (score < 2.6) return 'mid';
  return 'high';
};

export const bandForPotential = (score) => {
  if (score < 1.7) return 'low';
  if (score < 2.4) return 'mid';
  return 'high';
};

export const calcularCajaSugerida = (person) => {
  const row = bandForPerformance(person.performance_score);
  const col = bandForPotential(person.potential_score);
  return BOX_MATRIX[row][col];
};

export const getCaja = (person) => {
  if (person.en_pool) return null;
  if (person.caja_manual != null) return Number(person.caja_manual);
  return person.caja_sugerida;
};

export const scoreClass = (score) => {
  if (score < 1.6) return 'red';
  if (score < 2.6) return 'gray';
  if (score < 3.2) return 'green';
  return 'blue';
};

export const fmt = (n) => {
  if (n === null || n === undefined) return 'N/A';
  return Number(n).toFixed(1);
};

export const initials = (name) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};
