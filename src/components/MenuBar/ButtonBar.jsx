import './ButtonBar.css';
import { Link } from "react-router-dom";

function ButtonBar(props) {

  return (
    <Link key={props.value.id} className="button-bar" to={props.value.link} style={{backgroundColor: + '#' + props.value.button_color}}>
        <i className="material-symbols-outlined button-bar-icon">{props.value.img_icon}</i>
        <p className="button-bar-text">{props.value.name}</p>
    </Link>
  );
}   

export default ButtonBar;