// Debe coincidir con la validación de modules/rrhh-induccion/rrhh-induccion.routes.js en el backend.
export const GRUPO_RRHH = "'rrhh'";

export const TIPOS_INDUCCION = [
    { value: 'estandar', label: 'Estándar', descripcion: 'Incluye las inducciones generales.' },
    { value: 'jefatura', label: 'Jefatura / Gerencia', descripcion: 'Incluye las generales y permite agregar específicas.' },
];

export const PLANTAS = ['25 de Mayo', 'Suipacha'];

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
