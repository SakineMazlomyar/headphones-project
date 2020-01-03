import React  from 'react';
import './mainView.css'
import mainView from '../mainView.jpg'

export default class MainView extends React.Component{
    
    render(){
        return(
            <div>
            <div className="mainViewContainer">
                <h3>Välkomna Till Smart Headphones</h3>
                <p>These over-ear headphones are a landmark launch, becoming the highest-ever scoring wireless headphones
                 at our expert lab. <br/>The industry-leading active noise cancelling is the best we’ve yet seen,
                  they’re superbly comfortable, and the 27-plus hour battery life goes the distance. <br/>
                  They’re foldable and there’s even a detachable cord if you forget to charge them, 
                  plus a whole host of optional settings in the accompanying smartphone app.</p>
            </div>
            <div>
                  <img className={'mainViewImg'} src={process.env.PUBLIC_URL +`${mainView }`} alt={"main-view"}/>
            </div>

            </div>
            
        )
    }
}



