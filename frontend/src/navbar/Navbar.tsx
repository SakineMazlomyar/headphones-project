import React,{CSSProperties} from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
export default class Navbar extends React.Component{
    
    render(){
        return(
                
            <ul>
                <Link to={"/"}>
                   <h1>Hem</h1>
                </Link>
                <Link to={"/productPage"}>
                    <h3><span> Product Page</span></h3>
                </Link>
                <Link to={"/contact"}>
                    <h3><span> Contact Page</span></h3>
                </Link>
                <Link to={"/SigninSignUp"}>
                <h3><span> Signin SignUp Page</span></h3>
                </Link>
                
            </ul>
            
        )
    }
}

const ul:CSSProperties={
    display:"flex", 
    flexDirection:"column",
    justifyContent:"center"
 
}



