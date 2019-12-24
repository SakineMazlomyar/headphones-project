import React,{CSSProperties} from 'react';
import Navbar from './navbar/Navbar';
import ViewContainer from './ViewContainer';
interface State {

}
interface Props {

}
export default class Layout extends React.Component{
    constructor(props:Props){
        super(props);
            this.state = { 
            
        
        }
    }

    componentDidMount(){
        let seletedUsers:any = localStorage.getItem("users");
    
        if( !seletedUsers ) {
            let users = localStorage.setItem("users","[]");

        } else {
            
            console.log(JSON.parse(seletedUsers))
        }
    
    }




    render(){
        return(
                
            <div>
                <Navbar/>
                <ViewContainer/>
            </div>
            
        )
    }
}




