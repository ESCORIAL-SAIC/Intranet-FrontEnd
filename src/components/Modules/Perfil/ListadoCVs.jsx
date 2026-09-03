import { useEffect, useState } from "react";
import CVM from "./CVM";
import "./ListadoCVs.css";

function ListadoCVs(){

    const [cvs, setCvs] = useState([])
    const [deletedIds, setDeletedIds] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [nextId, setNextId] = useState(-1)
    const [error, setError] = useState('')

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const getCVs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/cvs`, {
                headers: { Authorization: token }
            });
            const data = await response.json();
            setCvs(Array.isArray(data) ? data : []);
        } catch(err) {
            console.log(err);
        }
    }

    const editar = () => {
        setEditMode(true);
    }

    const updateCVs = async () => {
        const token = localStorage.getItem('token');
        setError('');

        const newCvs = cvs.filter(cv => cv.id < 0);
        for (const cv of newCvs) {
            if (!cv.nombre_archivo || !cv.file) {
                setError('Por favor complete el nombre y seleccione un archivo para cada CV nuevo');
                return;
            }
        }

        try {
            for (const id of deletedIds) {
                await fetch(`${BASE_URL}/cvs/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: token }
                });
            }

            for (const cv of newCvs) {
                const formData = new FormData();
                formData.append('cv', cv.file);
                formData.append('nombre_archivo', cv.nombre_archivo);
                await fetch(`${BASE_URL}/cvs`, {
                    method: 'POST',
                    headers: { Authorization: token },
                    body: formData
                });
            }

            setEditMode(false);
            setDeletedIds([]);
            getCVs();
        } catch(err) {
            console.log(err);
            setError('Error guardando CVs');
        }
    }

    const agregarCV = () => {
        setCvs(v => [...v, { id: nextId, nombre_archivo: '', file: null }]);
        setNextId(n => n - 1);
    }

    const borrarCV = (id) => {
        if (id > 0) setDeletedIds(v => [...v, id]);
        setCvs(v => v.filter(cv => cv.id !== id));
    }

    const updateCVData = (id, field, value) => {
        setCvs(v => v.map(cv => cv.id === id ? { ...cv, [field]: value } : cv));
    }

    useEffect(() => {
        getCVs();
    }, [])

    return(
        <div className="cvsM">
            <p className="titulo-cvs-cargados">Currículum Vitae</p>
            <div className="listado-cvsM">
                <p className="error-cvs" id="error-cvs">{error}</p>
                <div className="listado-cvs-cm">
                    <div className="listado-cvs-container">
                        {cvs.map(cv => (
                            <CVM key={cv.id} cv={cv} editMode={editMode} eliminarCV={borrarCV} updateCVData={updateCVData} />
                        ))}
                    </div>
                    <div className="cv-botones">
                        <a className={`cv-icono-container ${editMode ? 'show' : 'hide'}`} id='cv-icono-container' onClick={agregarCV}>
                            <i className='material-symbols-outlined cv-icono'>add</i>
                        </a>
                    </div>
                </div>
                <a className={`listado-cv-boton ${editMode ? 'hide' : 'show'}`} id='cv-boton-editar' onClick={editar}>EDITAR</a>
                <a className={`listado-cv-boton ${editMode ? 'show' : 'hide'}`} id='cv-boton-guardar' onClick={updateCVs}>GUARDAR</a>
            </div>
        </div>
    )
}

export default ListadoCVs;
