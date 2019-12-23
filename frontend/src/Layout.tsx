import React,{CSSProperties} from 'react';
import Navbar from './navbar/Navbar';
import ViewContainer from './ViewContainer';

export default class Layout extends React.Component{
    
    render(){
        return(
                
            <div>
                <Navbar/>
                <ViewContainer/>
            </div>
            
        )
    }
}




