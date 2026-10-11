const LABELS = {
  exploring: 'Explorando',
  implementing: 'Implementando',
  archived: 'Cerrado',
};

export function stateLabel(state) {
  const label = LABELS[state];
  if (label === undefined) {
    throw new Error(`Estado no soportado: ${state}`);
  }
  return label;
}
