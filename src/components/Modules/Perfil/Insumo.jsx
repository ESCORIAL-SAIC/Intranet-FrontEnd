import './Insumo.css';

function Insumo(props){
    return(
    <div className="insumo">
        <p className="insumo-descripcion">{props.value.detalle}</p>
        <p className="insumo-tipo">{props.value.tipo}</p>
    </div>
    );
}

export default Insumo;