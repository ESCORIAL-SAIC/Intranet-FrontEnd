import './Tarea.css';

function Tarea(props) {

  return (
    <div className='tarea-c'>
        <p className='tarea-tipo'>{props.value.tipotransaccion}</p>
        <p className='tarea-cantidad'>{props.value.numero}</p>
    </div>
  );
}   

export default Tarea;