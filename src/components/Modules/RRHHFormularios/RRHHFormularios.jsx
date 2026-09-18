import { useState } from 'react';
import './RRHHFormularios.css';

import RiesgoImpactoTab from './components/RiesgoImpacto/RiesgoImpactoTab';
import GuiaPotencialTab from './components/GuiaPotencial/GuiaPotencialTab';

// Módulo con las dos solapas basadas en los maquetados de referencia
// (info-prompts/RRHHFormularios/Formulario Riesgo-Impacto de Pérdida.html,
//  info-prompts/RRHHFormularios/Guia de Potencial.html), sin la sección "Análisis de la IA".
function RRHHFormularios() {
    const [activeTab, setActiveTab] = useState('riesgo-impacto');

    return (
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">assignment</i>
                <p className="seccion-titulo">FORMULARIOS RRHH</p>
            </div>

            <div className="rf-solapa-principal">
                <div className="rf-selector">
                    <a href="#"
                        className={`rf-selector-boton ${activeTab === 'riesgo-impacto' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('riesgo-impacto'); }}>
                        Riesgo e Impacto de Pérdida
                    </a>
                    <a href="#"
                        className={`rf-selector-boton ${activeTab === 'guia-potencial' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('guia-potencial'); }}>
                        Guía de Potencial
                    </a>
                </div>
                <div className="rf-solapa-contenido">
                    {activeTab === 'riesgo-impacto' && <RiesgoImpactoTab />}
                    {activeTab === 'guia-potencial' && <GuiaPotencialTab />}
                </div>
            </div>
        </div>
    );
}

export default RRHHFormularios;
