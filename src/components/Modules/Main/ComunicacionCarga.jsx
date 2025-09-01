import './ComunicacionCarga.css';

function ComunicacionCarga(props) {

  return (
    <div className='comunicacion-carga'>
        <div className='comunicacion-carga-imagen skeleton'></div>
        <div className='skeleton-text-cont'>
          <div className='skeleton-text skeleton'></div>
          <div className='skeleton-text skeleton'></div>
          <div className='skeleton-text skeleton'></div>
        </div>
    </div>
  );
}   

export default ComunicacionCarga;