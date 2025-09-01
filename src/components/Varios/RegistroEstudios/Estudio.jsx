function Estudio({value, id}){

    return(
        <div className="estudio" index={id} id={'estudio'+id}>
            <select className="estudio-desplegable-tipo">
                {
                    value.estudios.map(estudio => (
                        <option value={estudio.id}>{estudio.nombre}</option>
                    ))
                }
            </select>
            <input type="text" className="estudio-completable"/>
            <select className="estudio-desplegable-progreso">
                {
                    value.progresos.map(progreso => (
                        <option value={progreso.id}>{progreso.nombre}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default Estudio;