function EmpleadoPuesto(props) {

    return (
        <div className="empleado-puesto">
            <iframe src={'data:application/pdf;base64,' + props.puesto} className='empleado-puesto-frame'/>
        </div>
    );
}

export default EmpleadoPuesto;