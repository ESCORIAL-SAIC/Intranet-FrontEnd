import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Encuesta() {

    let navigate = useNavigate();
    let { id } = useParams();
    const [encuestas, setEncuestas] = useState({})

    const getEncuestas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/empleado-cuestionarios-detalle',{
                headers: {
                    Authorization: token,
                    cuestionario_id: id
                }
            })
            const jsonData = await response.json();
            setEncuestas(jsonData[0]); 
            console.log(jsonData)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })
        getEncuestas();
      }, []);

    return (
        <div className="encuesta-empleado">
            {
            
            }
        </div>
    );
}

export default Encuesta;