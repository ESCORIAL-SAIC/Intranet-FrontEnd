import './GerenciaItem.css';

function GerenciaItem(props) {

  return (
    <div className='gerencia-item'>
      <div className='gerencia-item-top'>
        <p className='gerencia-nombre'>{props.value.nombre}</p>
      </div>
      <div className='gerencia-item-bot'>
        <i className="material-symbols-outlined gerencia-icon">domain</i>
        <p className='gerencia-descripcion'>{props.value.descripcion || 'Ver objetivos'}</p>
      </div>
    </div>
  );
}

export default GerenciaItem;
