export const PROJECT_CATEGORY_LABELS = {
  ilustracion: 'Ilustración',
  dibujo: 'Dibujo',
  exposicion: 'Exposición',
  comic: 'Cómic',
  edicion: 'Edición',
  animacion: 'Animación',
  audiovisual: 'Audiovisual',
  'proyecto-social': 'Proyecto social',
  divulgacion: 'Divulgación',
  beca: 'Beca'
} as const;

export const PROJECT_TYPE_LABELS = {
  ilustracion: 'Ilustración',
  exposicion: 'Exposición',
  comic: 'Cómic',
  edicion: 'Edición',
  animacion: 'Animación',
  audiovisual: 'Audiovisual',
  beca: 'Beca'
} as const;

export function projectCategoryLabel(category: string) {
  return PROJECT_CATEGORY_LABELS[category as keyof typeof PROJECT_CATEGORY_LABELS] ?? category;
}

export function projectTypeLabel(type: string) {
  return PROJECT_TYPE_LABELS[type as keyof typeof PROJECT_TYPE_LABELS] ?? type;
}
