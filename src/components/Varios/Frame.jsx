import './Varios.css';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

function Frame(props){
    let value = props.value;
    return(
        // <iframe className="frame" src={props.value} />
        <PowerBIEmbed
        embedConfig={{
        type: 'report', // 'report', 'dashboard', etc.
        id: 'TU-ID-DE-REPORTE', // Omitible si usás el embedUrl directamente
        embedUrl: value,
        tokenType: models.TokenType.Embed,
        accessToken: '', // Dejá vacío si es "public" (como en este caso)
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: true }
          },
        }
      }}
      cssClassName="frame"
      getEmbeddedComponent={(embeddedReport) => {
        console.log("Report loaded:", embeddedReport);
      }}
    />
    );
}

export default Frame;