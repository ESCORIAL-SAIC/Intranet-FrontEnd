import './Visualizador.css';

function Visualizador() {

  const ocultarVisualizador = () => {
    document.getElementById('visualizador').style.display = 'none'
  }

  return (
    <div id="visualizador" className='visualizador'>
        <div id="backgroud-visualizador" className='backgroud-visualizador' onClick={ocultarVisualizador}></div>
        <div className="img-container-visualizador">
            <img id="img-visualizador" className="img-visualizador"/>
        </div>
    </div>
  );
}   

export default Visualizador;