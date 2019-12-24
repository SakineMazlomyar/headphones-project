import React from 'react';
import { Switch } from 'react-router-dom' ;
import  { Route} from 'react-router';
import MainView from './mainView/MainView';
import ProductPage from './product/ProductPage';
import ContactPage from './contacts/ContactPage';
import Form from './signInSignUp/Form';
import ShoppingCard  from './shoppingCard/shoppingCard';
 interface State {

 }

 interface Props {
    signedInUser:()=>void
 }

export default class ViewContainer extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {

        }
    }
    render(){
        return (
        <React.Fragment>            
        <Switch>
            <React.Fragment>
                <Route exact path="/" component={MainView}  />
                <Route path="/productPage"  component={ProductPage}/>
                <Route path="/contact" component={ContactPage}/>
                <Route path="/SigninSignUp" render={()=> <Form signedInUser={this.props.signedInUser}/>} />
                <Route path="/shoppingCard" component={ShoppingCard}/>

            </React.Fragment>
        </Switch>
        </React.Fragment>
        
        
        )         
    }
}
