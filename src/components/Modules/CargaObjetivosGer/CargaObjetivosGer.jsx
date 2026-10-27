import './CargaObjetivosGer.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function CargaObjetivosGer() {

    let navigate = useNavigate()
    const [gerencias, setGerencias] = useState([]);
    const [gerenciaSeleccionada, setGerenciaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        objetivo: '',
        descripcion: ''
    });
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    // Datos de prueba
    const gerenciasPlaceholder = [
        { id: 1, nombre: "Gerencia de Prueba", objetivo: "Optimizar procesos de selección", descripcion: "Responsable del reclutamiento" },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Verificar permisos de acceso
        axios.get(process.env.REACT_APP_BASE_URL + "/perteneceagrupo", {
            headers: {
                Authorization: token,
                GrupoUsuario: "'Direccion','administradores','rrhh'"
            }
        }).then(res => {
            cargarGerencias();
        }).catch(err => {
            navigate('/')
        })
    }, [true]);

    const cargarGerencias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL + "/objetivos-gerencias", {
                headers: {
                    Authorization: token,
                }
            });
            const jsonData = await response.json();
            setGerencias(jsonData);
        } catch (err) {
            console.log(err.message);
            setGerencias(gerenciasPlaceholder);
        }
    };

    const handleSelectGerencia = (gerencia) => {
        setGerenciaSeleccionada(gerencia);
        setFormData({
            nombre: gerencia.nombre,
            objetivo: gerencia.objetivo || '',
            descripcion: gerencia.descripcion || ''
        });
        setMensaje('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!gerenciaSeleccionada) {
            setMensaje('Por favor selecciona una gerencia');
            return;
        }

        if (!formData.objetivo.trim()) {
            setMensaje('El objetivo es requerido');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL + "/gerencias/" + gerenciaSeleccionada.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMensaje('Objetivo actualizado correctamente');
                setTimeout(() => setMensaje(''), 3000);
                
                // Actualizar lista de gerencias
                const gerenciasActualizadas = gerencias.map(g =>
                    g.id === gerenciaSeleccionada.id ? { ...g, ...formData } : g
                );
                setGerencias(gerenciasActualizadas);
                setGerenciaSeleccionada({ ...gerenciaSeleccionada, ...formData });
            } else {
                setMensaje('Error al actualizar el objetivo');
            }
        } catch (err) {
            console.log(err.message);
            setMensaje('Error al actualizar el objetivo');
        } finally {
            setLoading(false);
        }
    };

    const limpiarFormulario = () => {
        setFormData({ nombre: '', objetivo: '', descripcion: '' });
        setGerenciaSeleccionada(null);
        setMensaje('');
    };

    return (
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">edit_square</i>
                <p className="seccion-titulo">Carga Objetivos de Gerencias</p>
            </div>
            <div className='carga-objetivos-ger'>
                <div className='cargo-objetivos-grid'>
                    {/* Panel de Gerencias */}
                    <div className='gerencias-panel'>
                        <h3 className='panel-titulo'>Selecciona una Gerencia</h3>
                        <div className='gerencias-lista'>
                            {gerencias.map((gerencia) => (
                                <div
                                    key={gerencia.id}
                                    className={`gerencia-item-selectable ${gerenciaSeleccionada?.id === gerencia.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectGerencia(gerencia)}
                                >
                                    <i className="material-symbols-outlined">domain</i>
                                    <span>{gerencia.nombre}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel de Edición */}
                    <div className='formulario-panel'>
                        {gerenciaSeleccionada ? (
                            <>
                                <h3 className='panel-titulo'>Editar Objetivo - {gerenciaSeleccionada.nombre}</h3>
                                <form onSubmit={handleSubmit} className='formulario-objetivo'>
                                    <div className='form-grupo'>
                                        <label htmlFor='nombre'>Nombre de la Gerencia</label>
                                        <input
                                            type='text'
                                            id='nombre'
                                            name='nombre'
                                            value={formData.nombre}
                                            disabled
                                            className='form-input'
                                        />
                                    </div>

                                    <div className='form-grupo'>
                                        <label htmlFor='objetivo'>Objetivo *</label>
                                        <textarea
                                            id='objetivo'
                                            name='objetivo'
                                            value={formData.objetivo}
                                            onChange={handleInputChange}
                                            className='form-textarea'
                                            rows='5'
                                            placeholder='Describe el objetivo principal de esta gerencia'
                                        />
                                    </div>

                                    <div className='form-grupo'>
                                        <label htmlFor='descripcion'>Descripción</label>
                                        <textarea
                                            id='descripcion'
                                            name='descripcion'
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                            className='form-textarea'
                                            rows='4'
                                            placeholder='Describe las responsabilidades de la gerencia'
                                        />
                                    </div>

                                    {mensaje && (
                                        <div className={`mensaje ${mensaje.includes('✓') ? 'exito' : 'error'}`}>
                                            {mensaje}
                                        </div>
                                    )}

                                    <div className='form-botones'>
                                        <button
                                            type='submit'
                                            className='boton-guardar'
                                            disabled={loading}
                                        >
                                            {loading ? 'Guardando...' : 'Guardar Objetivo'}
                                        </button>
                                        <button
                                            type='button'
                                            className='boton-limpiar'
                                            onClick={limpiarFormulario}
                                            disabled={loading}
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className='sin-seleccion'>
                                <i className="material-symbols-outlined">info</i>
                                <p>Selecciona una gerencia para editar su objetivo</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CargaObjetivosGer;
