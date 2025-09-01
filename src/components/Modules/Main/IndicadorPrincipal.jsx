import Frame from "../../Varios/Frame";
import './IndicadorPrincipal.css';

function IndicadorPrincipal(){
    return(
        <div className='indicador-principal'>
            <Frame value={'https://app.powerbi.com/view?r=eyJrIjoiMzM5ZWViYjYtMGY4Ni00NTU3LWE5OWYtYWQzOGM4YmNhNGJkIiwidCI6Ijg0Yzk5M2QxLWRiMDEtNGUzYy1iMzcxLThlZjJmNDNhZmZhZSIsImMiOjR9'}/>              
        </div>
    );
}

export default IndicadorPrincipal;