import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
interface Props{
    signedInUser:()=>any
}

interface State{

}
export default class Navbar extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
        this.state = {

        }
    }
    


    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
         
       
            <Link to={"/"}>
                   <span className="navbar-brand">SmartHeadphone</span>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">

            <li className="nav-item active">
            <Link to={"/productPage"}>
                    <span className="nav-link" > Product Page</span>
            </Link>
          </li>
          <li className="nav-item">
          
            <Link to={"/contact"}>
                    <span className="nav-link"> Contact Page</span>
            </Link>
          </li>
          <li  className="nav-item">
            <Link to={"/SigninSignUp"}>
                <span className="nav-link"> Signin SignUp Page</span>
            </Link>
          </li>
          <li  className="nav-item">
            {this.props.signedInUser()
            }
          </li>
        
        </ul>
            <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <h4  className="nav-item">
            <Link to={"/shoppingCard"}>
                <span  className="fas fa-shopping-cart text-black navbar-text nav-link kundVagnWidth"> kundvagn</span>
            </Link>
          </h4>
        </div>
        </nav>
            
        )
    }
}





