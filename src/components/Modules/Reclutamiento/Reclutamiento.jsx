import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState  } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

function Reclutamiento(){

    const [candidato, setCandidato] = useState({})
    const [descPuesto, setDescPuesto] = useState("")
    let navigate = useNavigate()

    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles)
        const pdfFiles = acceptedFiles.filter(file =>
          file.type === "application/pdf"
        );

        setDescPuesto(getPdfData(pdfFiles[0]))
        
      }, []);
    
    async function getPdfData(file) {
        const arrayBuffer = await file.arrayBuffer();
    
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
    
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str).join(' ');
            text += strings + '\n';
        }
    
        return text;
    }

      const enviarPdf = async () => {

        if(descPuesto == ''){return false}

        const token = localStorage.getItem('token');
        const response = await fetch(process.env.REACT_APP_BASE_URL+'/entrevistador',
            {
                method: 'POST',
                headers: { 
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {
                    'descripcion_puesto': descPuesto,
                })
            }
        );
        const jsonData = await response.json();
        setCandidato(jsonData) 
      }

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
          "application/pdf": [".pdf"]
        },
        multiple: false,
        noDrag: true,
      });

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })
      }, []);    

    return(
    <div>
    <div className="container">
        <div
        {...getRootProps()}
        style={{
            border: "2px dashed #999",
            padding: "20px",
            textAlign: "center",
            borderRadius: "10px",
            background: isDragActive ? "#eee" : "#fafafa"
        }}
        >
        <input {...getInputProps()} />
        {
            isDragActive
            ? <p>Suelta los archivos aquí...</p>
            : <p>Haz clic para seleccionar el pdf con la descripcion del puesto</p>
        }
        
        </div>
        <button onClick={enviarPdf}>Buscar</button>
        <div>{candidato?candidato.nombre_entrevistador:""}</div>
    </div>
    </div>
    );
}

export default Reclutamiento;