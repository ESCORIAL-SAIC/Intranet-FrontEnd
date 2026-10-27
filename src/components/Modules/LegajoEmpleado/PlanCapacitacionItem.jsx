import { useState } from "react";

function PlanCapacitacionItem({titulo, contenido, children}){

    const [mostrar, setMostrar] = useState(false)
    const showDetails = () => {
        setMostrar(!mostrar)
    }

    return(
        <div className="plan-capacitacion-item">
            <a href='#' className={
                mostrar
                ? "plan-capacitacion-desplegable open-c"
                : "plan-capacitacion-desplegable close-c"
            }
            onClick={showDetails}>
                <p className="empleado-plan-capacitacion-titulo">{titulo}</p>
                <i className={
                    mostrar
                    ? "material-symbols-outlined arrow-down-icon rotate0"
                    : "material-symbols-outlined arrow-down-icon rotate90"
                }>expand_more</i>
            </a>
            <div className={
                mostrar
                ? "plan-capacitacion-desplegable-container show-c"
                : "plan-capacitacion-desplegable-container hide-c"
            }>
                {children ? children : contenido}
            </div>
        </div>
    );
}

export default PlanCapacitacionItem;