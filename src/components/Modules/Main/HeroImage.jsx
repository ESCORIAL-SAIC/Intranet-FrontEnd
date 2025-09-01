import './HeroImage.css';
import banner from '../../../img/banner.jpg';
import banner2 from '../../../img/banner2.jpg';
import banner3 from '../../../img/banner3.jpg';

function HeroImage(){
    return(
        <div className="slider hero-container">
            <div className='slider-images'>
                <div className="img-container">
                    <img className="hero-image" src={banner} alt=""/>
                    <p align="left" className='hero-text'>BIENVENIDO <br/> A LA <br/> INTRANET <br/> ESCORIAL</p>
                </div>
                <div className="img-container">
                    <img className="hero-image" src={banner2} alt=""/>
                    <p align="left" className='hero-text'>BIENVENIDO <br/> A LA <br/> INTRANET <br/> ESCORIAL</p>
                </div>
                <div className="img-container">
                    <img className="hero-image" src={banner3} alt=""/>
                    <p align="left" className='hero-text'>BIENVENIDO <br/> A LA <br/> INTRANET <br/> ESCORIAL</p>
                </div>
                
            </div>
        </div>
    );
}

export default HeroImage;