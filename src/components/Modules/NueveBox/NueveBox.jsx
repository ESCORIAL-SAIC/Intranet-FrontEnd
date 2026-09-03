import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NueveBox.css';

import { BOX_META } from './constants';
import { getCaja } from './utils';
import RegistroList from './components/RegistroList';
import NuevoRegistroForm from './components/NuevoRegistroForm';
import ResumenMetrics from './components/ResumenMetrics';
import Toolbar from './components/Toolbar';
import PoolPanel from './components/PoolPanel';
import BoxGrid from './components/BoxGrid';
import PersonDrawer from './components/PersonDrawer';

export default function NueveBox() {
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const [registrosPropios, setRegistrosPropios] = useState([]);
  const [registrosSubordinados, setRegistrosSubordinados] = useState([]);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [puedeEditar, setPuedeEditar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', area: 'all', box: 'all' });
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showNewRegistroForm, setShowNewRegistroForm] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const axiosConfig = { headers: { Authorization: token } };

  const showToast = (message, type = 'error', duration = 4000) => {
    clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    if (token) {
      axios.get(`${baseURL}/main`, axiosConfig).catch(() => navigate('/login'));
      cargarRegistros();
    } else {
      navigate('/login');
    }
  }, [navigate, baseURL, token]);

  const cargarRegistros = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/nuevebox`, axiosConfig);
      setRegistrosPropios(response.data.propios || []);
      setRegistrosSubordinados(response.data.subordinados || []);
    } catch (error) {
      console.error('Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEvaluaciones = async (registroId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/nuevebox/${registroId}`, axiosConfig);
      setRegistroSeleccionado(response.data.registro);
      setEvaluaciones(response.data.evaluaciones);
      setPuedeEditar(response.data.puede_editar === true);
      setSelectedPersonId(response.data.evaluaciones[0]?.empleado_id || null);
      setFilters({ q: '', area: 'all', box: 'all' });
      return response.data;
    } catch (error) {
      console.error('Error cargando evaluaciones:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearRegistro = async (nombre, anio) => {
    try {
      setLoading(true);
      await axios.post(`${baseURL}/nuevebox`, { nombre, anio, estado: 'borrador' }, axiosConfig);
      setShowNewRegistroForm(false);
      cargarRegistros();
    } catch (error) {
      console.error('Error creando registro:', error);
      showToast(error.response?.data?.error || 'Error creando registro');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoRegistro = async (nuevoEstado) => {
    if (!registroSeleccionado) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `${baseURL}/nuevebox/${registroSeleccionado.id}`,
        { estado: nuevoEstado },
        axiosConfig
      );
      setRegistroSeleccionado(response.data.data);
      cargarRegistros();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showToast(error.response?.data?.error || 'Error actualizando estado');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEvaluacion = async (empleadoId, cajaManual, comentario, enPool) => {
    if (!registroSeleccionado) return;
    try {
      await axios.put(
        `${baseURL}/nuevebox/${registroSeleccionado.id}/evaluacion/${empleadoId}`,
        { caja_manual: cajaManual, comentario, en_pool: enPool },
        axiosConfig
      );
      const data = await cargarEvaluaciones(registroSeleccionado.id);
      if (cajaManual) {
        const advertencias = (data?.alerta_distribucion?.advertencias || [])
          .filter(a => a.cajas?.includes(Number(cajaManual)));
        if (advertencias.length > 0) {
          showToast(advertencias.map(a => a.mensaje).join('\n'), 'warning', 7000);
        }
      }
    } catch (error) {
      console.error('Error actualizando evaluación:', error);
      showToast(error.response?.data?.error || 'Error actualizando evaluación');
    }
  };

  const canEdit = puedeEditar && registroSeleccionado?.estado === 'borrador';

  // Drag handlers
  const handleDragStart = (e, person, source) => {
    if (!canEdit) { e.preventDefault(); return; }
    setDraggedItem({ person, source });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ source, id: person.empleado_id }));
  };

  const handleDragOver = (e) => {
    if (!canEdit) return;
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDropOnCell = (e, targetBox) => {
    if (!canEdit) return;
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!draggedItem) return;
    const { person, source } = draggedItem;
    actualizarEvaluacion(person.empleado_id, targetBox, person.comentario, source === 'pool' ? false : false);
    setDraggedItem(null);
  };

  const handleDropOnPool = (e) => {
    if (!canEdit) return;
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!draggedItem || draggedItem.source !== 'grid') return;
    actualizarEvaluacion(draggedItem.person.empleado_id, null, draggedItem.person.comentario, true);
    setDraggedItem(null);
  };

  // Derived data
  const matchesFilters = (person) => {
    const q = filters.q.trim().toLowerCase();
    const box = String(getCaja(person));
    if (box === 'null' || box === 'undefined') return false;
    const matchesQ = !q || [person.empleado_nombre, person.puesto, person.area, person.manager]
      .some(v => v && v.toLowerCase().includes(q));
    const matchesArea = filters.area === 'all' || person.area === filters.area;
    const matchesBox = filters.box === 'all' || box === filters.box;
    return matchesQ && matchesArea && matchesBox;
  };

  const filtered = evaluaciones.filter(matchesFilters);
  const poolPeople = evaluaciones.filter(p => p.en_pool);
  const gridPeople = evaluaciones.filter(p => !p.en_pool);
  const areas = [...new Set(evaluaciones.map(p => p.area))].sort().filter(Boolean);
  const selected = evaluaciones.find(p => p.empleado_id === selectedPersonId);

  const summary = {
    total: evaluaciones.length,
    pending: poolPeople.length,
    assigned: gridPeople.length,
    a: gridPeople.filter(p => BOX_META[getCaja(p)]?.group === 'A').length,
    b: gridPeople.filter(p => BOX_META[getCaja(p)]?.group === 'B').length,
    c: gridPeople.filter(p => BOX_META[getCaja(p)]?.group === 'C').length,
  };

  const volverALista = () => {
    setRegistroSeleccionado(null);
    setEvaluaciones([]);
    setSelectedPersonId(null);
    setPuedeEditar(false);
  };

  // Vista: lista de registros
  if (!registroSeleccionado) {
    return (
      <div className="container nueve-box-container">
        <div className="seccion">
          <i className="material-symbols-outlined seccion-icon">grid_3x3</i>
          <p className="seccion-titulo">MATRIZ 9-BOX</p>
        </div>

        <section className="hero">
          <div className="eyebrow">Escorial - Sistema de Talento 2026</div>
          <h1>Gestión de Matriz 9-Box</h1>
          <p className="subhead">
            Selecciona o crea un registro 9-box para comenzar a evaluar y gestionar el talento de tu organización.
          </p>
        </section>

        <div style={{ margin: '20px', marginBottom: '20px' }}>
          <button className="btn" onClick={() => setShowNewRegistroForm(!showNewRegistroForm)}>
            {showNewRegistroForm ? 'Cancelar' : '+ Nuevo Registro'}
          </button>
          {showNewRegistroForm && (
            <NuevoRegistroForm onCrear={crearRegistro} loading={loading} />
          )}
        </div>

        <RegistroList
          titulo="Mis Evaluaciones"
          registros={registrosPropios}
          loading={loading}
          onSeleccionar={cargarEvaluaciones}
          soloLectura={false}
          emptyMsg="No tenés registros propios. Creá uno nuevo para comenzar."
        />

        {registrosSubordinados.length > 0 && (
          <RegistroList
            titulo="Evaluaciones de mi Equipo"
            registros={registrosSubordinados}
            loading={loading}
            onSeleccionar={cargarEvaluaciones}
            soloLectura={true}
            emptyMsg=""
          />
        )}

        {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
      </div>
    );
  }

  // Vista: evaluación 9-box
  return (
    <div className="container nueve-box-container">
      <div className="seccion">
        <i className="material-symbols-outlined seccion-icon">grid_3x3</i>
        <p className="seccion-titulo">MATRIZ 9-BOX</p>
      </div>

      <section className="hero">
        <div className="eyebrow">Escorial - Sistema de Talento 2026</div>
        <h1>{registroSeleccionado.nombre} - {registroSeleccionado.anio}</h1>
        <p className="subhead">
          {puedeEditar
            ? 'Gestiona el talento de tu organización evaluando desempeño y potencial.'
            : 'Vista de solo lectura — esta evaluación pertenece a un colaborador de tu equipo.'}
        </p>
        <div className="meta-row">
          <span className="pill">Fuente: Base de datos</span>
          <span className="pill">Vista: 3 x 3 con detalle lateral</span>
          <span className="pill">
            Modo: {registroSeleccionado.estado.charAt(0).toUpperCase() + registroSeleccionado.estado.slice(1)}
          </span>
          {!puedeEditar && (
            <span className="pill" style={{ background: 'var(--blue-soft)', color: '#0d4e89', fontWeight: 600 }}>
              Solo lectura
            </span>
          )}
          <button
            className="btn"
            onClick={volverALista}
            style={{ padding: '6px 12px', fontSize: '12px', marginLeft: 'auto', margin: '20px' }}
          >
            Volver a Registros
          </button>
        </div>
      </section>

      <ResumenMetrics summary={summary} />

      <Toolbar
        filters={filters}
        onFiltersChange={setFilters}
        areas={areas}
        estadoRegistro={registroSeleccionado.estado}
        onEstadoChange={actualizarEstadoRegistro}
        canEdit={canEdit}
      />

      <PoolPanel
        poolPeople={poolPeople}
        canEdit={canEdit}
        estadoRegistro={registroSeleccionado.estado}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropOnPool}
        onDragStart={handleDragStart}
      />

      <section className="layout">
        <BoxGrid
          filtered={filtered}
          canEdit={canEdit}
          selectedPersonId={selectedPersonId}
          onSelectPerson={setSelectedPersonId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDropOnCell={handleDropOnCell}
          onDragStart={handleDragStart}
        />

        <aside className="panel drawer">
          <PersonDrawer
            selected={selected}
            canEdit={canEdit}
            evaluaciones={evaluaciones}
            onComentarioChange={(empleadoId, value) => {
              setEvaluaciones(evaluaciones.map(p =>
                p.empleado_id === empleadoId ? { ...p, comentario: value } : p
              ));
            }}
            onComentarioSave={(person) => {
              actualizarEvaluacion(person.empleado_id, person.caja_manual, person.comentario, person.en_pool);
            }}
          />
        </aside>
      </section>

      <div className="footer">
        <span>Modelo 9-Box Escorial - Datos desde base de datos</span>
        <span>Registro: {registroSeleccionado.nombre} ({registroSeleccionado.anio})</span>
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}