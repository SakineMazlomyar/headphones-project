import React  from 'react';
import './mainView.css'
import mainView from '../mainView.jpg'

export default class MainView extends React.Component{
 
    render(){

        return(
            <div>
            <div className="mainViewContainer">
                <h4 > Welcome To SmartHeaphones</h4>
                <p className="paragraph">
                    SmartHeaphones is a new dropshipping website in Sweden.Smart headphones
                    present a new direction for headphones and personal audio devices.Until 
                    now, headphones have been limited to playing music, general audio, or 
                    providing noise cancelation features. Smart headphones combine the intelligence
                    of a smartphone with the audio capabilities of headphones, and extend those 
                    capabilities beyond any personal audio device.Some of these smart capabilities 
                    include language translation, fitness and heart rate tracking,voice-based personal 
                    assistants, contextual location-based suggestions, environment-based noise 
                    suppression or audio enhancement, and gesture and touch-based control, among others.
                </p>
            </div>
            <div>
                  <img className={'mainViewImg'} src={process.env.PUBLIC_URL +`${mainView }`} alt={"main-view"}/>
            </div>

            </div>
            
        )
    }
}



