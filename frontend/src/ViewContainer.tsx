import React from 'react';
import { Switch } from 'react-router-dom' ;
import  { Route} from 'react-router';
import MainView from './mainView/MainView';
import ProductPage from './product/ProductPage';
import ContactPage from './contacts/ContactPage';
import Form from './signInSignUp/Form';
import ShoppingCard  from './shoppingCard/shoppingCard';
import CheckOut from './checkOut/checkOut';

interface Product {
    productName: string,
    _id:string,
    unitPrice:number,
    unitInStock:number,
    pictureUrl:string
}
 interface State {
    products:Product[]
 }
 
interface CurrentUser {
    id:string,
    username:string
}

 interface Props {
    signedInUser:()=>void,
    userInfo:CurrentUser
 }

export default class ViewContainer extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            products:[]
        }
    }

    getAddedProducts = (products:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>{
     
        return products
    }
    render(){
        return (
        <React.Fragment>            
        <Switch>
            <React.Fragment>
                <Route exact path="/" component={MainView}  />
                <Route path="/productPage"  render={ ()=> <ProductPage getAddedProducts={this.getAddedProducts}/>}/>
                <Route path="/contact" component={ContactPage}/>
                <Route path="/SigninSignUp" render={()=> <Form signedInUser={this.props.signedInUser} userInfo={this.props.userInfo}/>} />
                <Route path="/shoppingCard" component={ShoppingCard}/>
                <Route path="/checkOut" render={()=><CheckOut/>}/>

            </React.Fragment>
        </Switch>
        </React.Fragment>
        
        
        )         
    }
}
