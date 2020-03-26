import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { changeUrl, getValueFromLocalstoreage } from '../helpers/requestHandler';
import { Tooltip } from 'reactstrap';

import * as _ from 'underscore';
interface Props{
    signedInUser:()=>any,
    amount:number,
    totalPrice:number
}

interface State{

  tooltipOpen:boolean,
  totalPrice:number

}

export default class Navbar extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
        this.state = {
      
          tooltipOpen:false,
          totalPrice:0
        }
    }

    getLegthOfProducts = () => {
      let shoppingCart:any = getValueFromLocalstoreage("shoppingcart");
      if(shoppingCart !== null) {

        let amount = this.props.amount !== 0 ? this.props.amount : shoppingCart.length
        return `(${amount})`
      }
      
    }
    componentDidMount() { this.handleOrderPrice()}
   
    handleOrderPrice = ()=> { 
      let shoppingCart:any = getValueFromLocalstoreage("shoppingcart");
      
          let initTolatlPrice = 0
          
          if( shoppingCart !== null && shoppingCart.length > 0) {
            
              for(let product of shoppingCart) {
                  let price = product.unitPrice
              
                  initTolatlPrice += price
              }
         
            this.setState({totalPrice: initTolatlPrice}) 
          }
    
    }
   
    renderProductDetail = () => {
      let shoppingCart:any = getValueFromLocalstoreage("shoppingcart");
      
      if(shoppingCart && shoppingCart !== null && shoppingCart.length > 0) {
        let ids = shoppingCart.map((el:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string })=>{
          return el._id
        })  
        let count:any = {};
        ids.forEach(function(i:any) { 
        count[i] = (count[i]||0) + 1});
      
   
        let uniqProducts =  _.uniq(shoppingCart.filter( (pr:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string,amount:any }) =>{
              let rt:string
            
            for(rt in count ) {
          
                if(pr._id === rt ) {
                  pr.amount = count[rt]
                return pr
                 
                }
            } 

        }), '_id').map((product:any)=>{
    
           return <div className={"d-flex flex-column align-items-center"}>
                    <img className={'imgNav'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                    <span>{product.productName}</span>
                    <span>{product.unitPrice+' SEK'}</span>
                    <span>Quantity: {product.amount}</span>
                  </div>
    
        })  
     
        return <div>
                  {uniqProducts}
                  <h6 id={"totalPrice"}>Total Amount:  {`${this.props.totalPrice === 0?  this.state.totalPrice: this.props.totalPrice } SEK` }</h6>
             </div>


      } else {
        return <span>Your shopping cart is empty!</span>
      }
    }


    
    toggle = () =>{ this.setState(state => ({ tooltipOpen:!state.tooltipOpen})) }
  

    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light nav-margin">
                
            <Link to={"/"}>
                   <span className="navbar-brand" onClick={()=>{ changeUrl('main')}}>SmartHeadphones</span>
                 
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">

            <li className="nav-item active">
            <Link to={"/productPage"}>
                   
                    <span className="nav-link" onClick={()=>{ changeUrl('productPage')}}> Product Page</span>
            </Link>
          </li>
          <li className="nav-item">
          
            <Link to={"/contact"}>
                    <span className="nav-link" onClick={()=>{ changeUrl('contact')}}> Contact Page</span>
            </Link>
          </li>
          <li  className="nav-item">
            <Link to={"/SignInSignUp"}>
                <span className="nav-link" onClick={()=>{ changeUrl('SignInSignUp')}}> SignIn SignUp Page</span>
            </Link>
          </li>
          <li  className="nav-item">
            {this.props.signedInUser()
            }
          </li>
        
        </ul>
            
        <h4  className="nav-item">
                
            <Link to={"/shoppingCard"}>
              
                <span 
                onClick={()=>{ changeUrl('shoppingCard')}} 
                className="fas fa-shopping-cart text-black navbar-text nav-link kundVagnWidth" id="TooltipExample"> 

            
              <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
                <ul>
                  {this.renderProductDetail()}
                </ul>
              </Tooltip>
            
       
                Shopping Cart {this.getLegthOfProducts()}</span>
            </Link>
          </h4>
        </div>
        </nav>
            
        )
    }
}





