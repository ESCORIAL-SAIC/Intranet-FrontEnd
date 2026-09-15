import './ModalObjetivos.css';

function ModalObjetivos({ gerencia, onClose, modalRef }) {

  const cerrarModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
    onClose();
  };

  if (!gerencia) return null;

  return (
    <div ref={modalRef} id="modal-objetivos" className='modal-objetivos'>
      <div id="background-modal" className='background-modal' onClick={cerrarModal}></div>
      <div className="modal-objetivos-container">
        <div className="modal-header">
          <h2 className="modal-titulo">{gerencia.nombre}</h2>
          <button className="modal-close-btn" onClick={cerrarModal}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <div className="modal-content">
          <div className="objetivo-seccion">
            <h3 className="objetivo-subtitulo">Objetivo</h3>
            <p className="objetivo-texto">{gerencia.objetivo || 'Sin objetivo definido'}</p>
          </div>
          {
            gerencia.descripcion && (
              <div className="objetivo-seccion">
                <h3 className="objetivo-subtitulo">Descripción</h3>
                <p className="objetivo-texto">{gerencia.descripcion}</p>
              </div>
            )
          }
          {
            gerencia.imagen && (
              <div className="objetivo-seccion">
                <h3 className="objetivo-subtitulo">Imagen</h3>
                <img src={'data:image/jpg;base64,' + gerencia.imagen} alt={gerencia.nombre} className="objetivo-imagen" />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default ModalObjetivos;
