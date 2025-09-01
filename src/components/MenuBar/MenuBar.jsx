import './MenuBar.css';
import ButtonBar from './ButtonBar';
import { useEffect, useState } from 'react';

function MenuBar() {

  const [buttons, setButtons] = useState([]);  

  const getButtons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(process.env.REACT_APP_BASE_URL+"/menu-button",{
        headers: {
            Authorization: token,
        }
      })
      const jsonData = await response.json();
      setButtons(jsonData);

    } catch (err) {
      console.log(err.message)
    }
  };

  useEffect(() => {
    getButtons();
  }, []);

  return (
    <div className="menu-bar">
      <i className="material-symbols-outlined button-bar-icon-ham">menu</i>
        {buttons.map(button => (
          <ButtonBar value={button}/>
        ))}
    </div>
  );
}   

export default MenuBar;