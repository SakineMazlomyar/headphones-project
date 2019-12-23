import React from 'react';
import { Switch } from 'react-router-dom' ;
import  { Route} from 'react-router';
import MainView from './mainView/MainView';
import ProductPage from './product/ProductPage';
import ContactPage from './contacts/ContactPage';
import Form from './signInSignUp/Form'


export default class ViewContainer extends React.Component{
   
    render(){
        return (
        <React.Fragment>            
        <Switch>
            <React.Fragment>
                <Route exact path="/" component={MainView}  />
                <Route path="/productPage"  component={ProductPage}/>
                <Route path="/contact" component={ContactPage}/>
                <Route path="/SigninSignUp" component={Form}/>

            </React.Fragment>
        </Switch>
        </React.Fragment>
        
        
        )         
    }
}
