import React,{ Component } from 'react';
//import Form from './signInSignUp/Form';
import Layout from './Layout'
import { BrowserRouter } from 'react-router-dom';

interface State {
    userId:string,
    email:string

}

interface Props {}
    export default class App  extends Component<Props,State> {

    constructor(props: Props){
        super(props);
        this.state = {
            userId:'',
            email:''
        }
    }

    isLoggedin = (user:{email:string, userId:string})=>{
        this.setState({userId:user.userId, email:user.email})
    }
   
    render() {

    return (
    <div>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </div>
    )}

}

