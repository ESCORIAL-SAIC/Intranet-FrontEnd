import './Cumple.css';

function Cumple(props) {

  return (
    <div className='cumple'>
        <div className='cumple-top'>
            <p className='cumple-nombre'>{props.value.nombrecompleto}</p>
        </div>
        <div className='cumple-bot'>
            <p className='cumple-puesto'>{props.value.puesto}</p>
            <p className='cumple-fecha'>{props.value.fechacumple}</p>
        </div>
    </div>
  );
}   

export default Cumple;