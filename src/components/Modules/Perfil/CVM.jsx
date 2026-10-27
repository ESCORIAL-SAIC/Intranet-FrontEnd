function CVM({ cv, editMode, eliminarCV, updateCVData }) {

    const isNew = cv.id < 0;

    return(
        <div className="cv-mod" id={cv.id}>
            <input
                type="text"
                className="cv-input cv-descripcion"
                placeholder="Nombre del CV"
                value={cv.nombre_archivo || ""}
                onChange={e => updateCVData(cv.id, 'nombre_archivo', e.target.value)}
                disabled={!editMode || !isNew}
            />
            {isNew && (
                <input
                    type="file"
                    className="cv-input cv-archivo"
                    accept=".pdf,.doc,.docx"
                    onChange={e => updateCVData(cv.id, 'file', e.target.files[0])}
                    disabled={!editMode}
                />
            )}
            {!isNew && cv.fecha && (
                <span className="cv-fecha">{new Date(cv.fecha).toLocaleDateString()}</span>
            )}
            {editMode && (
                <button className="cv-icono-container" onClick={() => eliminarCV(cv.id)}>
                    <i className='material-symbols-outlined cv-icono'>remove</i>
                </button>
            )}
        </div>
    )
}

export default CVM;
