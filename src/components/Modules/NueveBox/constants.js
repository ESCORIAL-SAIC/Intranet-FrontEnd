export const BOX_MATRIX = {
  high: { low: 4, mid: 7, high: 9 },
  mid: { low: 2, mid: 5, high: 8 },
  low: { low: 1, mid: 3, high: 6 }
};

export const BOX_META = {
  1: { group: 'C', tone: 'red', title: 'Necesita desarrollo' },
  2: { group: 'B', tone: 'gray', title: 'Desempeño sólido' },
  3: { group: 'C', tone: 'red', title: 'Necesita desarrollo' },
  4: { group: 'B', tone: 'green', title: 'Alto desempeño' },
  5: { group: 'B', tone: 'gray', title: 'Desempeño sólido' },
  6: { group: 'C', tone: 'red', title: 'Necesita desarrollo' },
  7: { group: 'B', tone: 'green', title: 'Alto desempeño' },
  8: { group: 'A', tone: 'blue', title: 'Alto potencial' },
  9: { group: 'A', tone: 'blue', title: 'Alto potencial' }
};

export const CELL_ORDER = [
  { box: 4, row: 'Alto desempeño', col: 'Bajo potencial' },
  { box: 7, row: 'Alto desempeño', col: 'Potencial medio' },
  { box: 9, row: 'Alto desempeño', col: 'Alto potencial' },
  { box: 2, row: 'Desempeño sólido', col: 'Bajo potencial' },
  { box: 5, row: 'Desempeño sólido', col: 'Potencial medio' },
  { box: 8, row: 'Desempeño sólido', col: 'Alto potencial' },
  { box: 1, row: 'Bajo desempeño', col: 'Bajo potencial' },
  { box: 3, row: 'Bajo desempeño', col: 'Potencial medio' },
  { box: 6, row: 'Bajo desempeño', col: 'Alto potencial' }
];