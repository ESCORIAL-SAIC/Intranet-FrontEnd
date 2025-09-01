import './Comunicacion.css';

function Comunicacion(props) {

  const mostrarComunicacion = (e) => {
    document.getElementById('visualizador').style.display = 'flex'
    document.getElementById('img-visualizador').src = e.target.src
  }

  return (
    <div className='comunicacion'>
        <img className='comunicacion-imagen' src={'data:image/jpg;base64,'+ props.value.imagen} onClick={mostrarComunicacion}/>
        <p className='comunicacion-asunto'>{props.value.asunto}</p>
    </div>
  );
}

export default Comunicacion;