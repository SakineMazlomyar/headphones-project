import React from 'react';
import { Switch } from 'react-router-dom' ;
import  { Route} from 'react-router';
import MainView from './mainView/MainView';
import ProductPage from './product/ProductPage';
import ContactPage from './contacts/ContactPage';
import Form from './signInSignUp/Form';
import ShoppingCard  from './shoppingCard/shoppingCard';
import CheckOut from './checkOut/checkOut';
import Admin from './admin/admin';
import SingleProduct from './singleProduct/SingleProduct';
 
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
    username:string,
    email:string
}

 interface Props {
    signedInUser:()=>void,
    userInfo:CurrentUser,
    getAddedProducts:(data:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>void,
    totalPrice:number,
    amount:number
 }

export default class ViewContainer extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            products:[]
        }
    }

    render(){
        return (
        <React.Fragment>            
        <Switch>
            <React.Fragment>
                <Route exact path="/" component={MainView}  />
                <Route path="/productPage"  render={ ()=> <ProductPage 
                getAddedProducts={this.props.getAddedProducts} 
              
                />}/>
                <Route path="/contact" component={ContactPage}/>
                <Route path="/SigninSignUp" render={()=> <Form signedInUser={this.props.signedInUser} userInfo={this.props.userInfo}/>} />
                <Route path="/shoppingCard" render={ ()=> <ShoppingCard  amount={this.props.amount} getAddedProducts={this.props.getAddedProducts} /> }/>
                <Route path="/checkOut" render={()=><CheckOut totalPrice={this.props.totalPrice} userInfo={this.props.userInfo}/>}/>
                <Route path="/admin" component={Admin}/>
                <Route path="/singleProduct"  render={ ()=> <SingleProduct   getAddedProducts={this.props.getAddedProducts} /> }/>

            </React.Fragment>
        </Switch>
        </React.Fragment>)          
    }
}
