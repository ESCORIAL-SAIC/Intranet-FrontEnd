import './MainMenuBar.css';
import MainButtonBar from './MainButtonBar';
import { useEffect, useState } from 'react';

function MainMenuBar() {

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
    <div className="main-menu-bar">
        {buttons.map(button => (
          <MainButtonBar value={button}/>
        ))}
    </div>
  );
}   

export default MainMenuBar;