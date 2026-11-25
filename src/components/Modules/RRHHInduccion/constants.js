// Debe coincidir con la validación de modules/rrhh-induccion/rrhh-induccion.routes.js en el backend.
export const GRUPO_RRHH = "'rrhh'";

export const TIPOS_INDUCCION = [
    { value: 'estandar', label: 'Estándar', descripcion: 'Incluye las inducciones generales.' },
    { value: 'jefatura', label: 'Jefatura / Gerencia', descripcion: 'Incluye las generales y permite agregar específicas.' },
];

export const PLANTAS = ['25 de Mayo', 'Suipacha'];

// Evaluaciones de Forms asignables a una inducción (una por inducción). Los códigos deben
// coincidir con EVALUACIONES en modules/rrhh-induccion/rrhh-induccion.routes.js.
export const EVALUACIONES = {
    rrhh: { label: 'Inducción RRHH', url: 'https://forms.cloud.microsoft/r/g5ZCB9VrLR' },
    ssma: { label: 'Inducción SSMA', url: 'https://forms.cloud.microsoft/r/uUeSWezQpD' },
    calidad: { label: 'Inducción Calidad', url: 'https://forms.cloud.microsoft/r/dMZGwasehw' },
};

// Se habilita a los 30 días del ingreso (DIAS_ENCUESTA_1MES en el backend).
export const ENCUESTA_1MES_URL = 'https://forms.cloud.microsoft/r/5GqDDNiQ24';

export const ESTADOS_ENCUESTA_1MES = {
    no_corresponde: { label: 'No corresponde aún', className: 'estado-borrador' },
    pendiente: { label: 'Pendiente', className: 'estado-curso' },
    completada: { label: 'Completada', className: 'estado-finalizado' },
};

export const ESTADOS_ROADMAP = {
    borrador: { label: 'Borrador', className: 'estado-borrador' },
    publicado: { label: 'En curso', className: 'estado-curso' },
    finalizado: { label: 'Finalizada', className: 'estado-finalizado' },
};

// Ventana de "ingreso reciente" que se ofrece al crear un roadmap (días desde la fecha de ingreso).
export const OPCIONES_DIAS_NUEVOS = [30, 60, 90, 180];

export const INFO_UTIL_LINKS = {
    foodService: 'https://catering.foodservice.com.ar/',
    foodServiceInstructivo: 'https://view.genially.com/611fd97724be320d712a64f4/video-presentation-plataforma-food-service',
    clubBeneficios: 'https://clubdebeneficios.com/',
};

export const CONTACTOS_IMPORTANTES = [
    { label: 'WhatsApp de Recursos Humanos', valor: '11 5162-3408' },
    { label: 'WhatsApp del Servicio Médico (Enfermero Leandro)', valor: '11 4194-6828' },
];
