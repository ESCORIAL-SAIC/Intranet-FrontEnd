// Debe coincidir con la validación de modules/admin-accesos/admin-accesos.routes.js en el backend.
export const GRUPO_ADMIN = "'administradores'";
export const NOMBRE_GRUPO_ADMIN = 'administradores';

// La solapa de administración de accesos no se puede eliminar ni perder el rol administradores.
export const LINK_ADMIN_ACCESOS = '/admin-accesos';

// Rol que hace visible una solapa para todos los usuarios.
export const NOMBRE_ROL_TODOS = 'Todos';

export const ACCESO_VACIO = { name: '', link: '', img_icon: '', button_color: 'ffffff', orden: '' };

// Cantidad máxima de roles sugeridos al buscar.
export const MAX_SUGERENCIAS_ROLES = 8;
