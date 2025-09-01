function  BotonAccesoRegistroEstudios(){

    const mostrarVisualizador = () => {
        document.getElementById('visualizador-carga-estudios').style.display = 'flex'
    }

    return(
        <a className="acceso-registro-estudios" href="#" onClick={mostrarVisualizador}>
            <i className="material-symbols-outlined icono-registro-estudios">edit_document</i>
            <p className="acceso-registro-estudios-texto">COMPLETAR PLANILLA DE ESTUDIOS</p>
            <div className="acceso-registro-flecha"><i className="material-symbols-outlined">chevron_right</i></div>
        </a>
    );
}

export default BotonAccesoRegistroEstudios;