import EncuestaTarjeta from "./Encuesta/EncuestaTarjeta";

function EmpleadoEncuesta(props) {
    return (
        <div className="empleado-encuestas">
            <div className="">
                {
                props.encuestas?.map(encuesta => (
                    <EncuestaTarjeta encuesta={encuesta}/>
                ))
                }
            </div>
        </div>
    );
}

export default EmpleadoEncuesta;