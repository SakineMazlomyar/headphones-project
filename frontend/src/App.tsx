import React,{ Component } from 'react';
import Form from './Form';


interface State {

}

interface Props {}
    export default class App  extends Component<Props,State> {

    constructor(props: Props){
        super(props);
        this.state = {

        }
    }

    isLoggedin = (user:{email:string, userId:string,isLoggedIn:boolean})=>{

    }


    render() {
    return (

    <div>
        <Form isLoggedin={this.isLoggedin}/>
    </div>
    )}

}

