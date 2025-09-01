import './MainButtonBar.css';
import { Link } from "react-router-dom";

function MainButtonBar(props) {

  return (
    <Link key={props.value.id} className="main-button-bar" to={props.value.link} style={{backgroundColor: + '#' + props.value.button_color}}>
        <i className="material-symbols-outlined button-bar-icon">{props.value.img_icon}</i>
        <p className="main-button-bar-text">{props.value.name}</p>
    </Link>
  );
}   

export default MainButtonBar;