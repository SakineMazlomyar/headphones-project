import React,{CSSProperties} from 'react';
import './contactPage.css'
import support from '../support.jpg'
import FormNall from '../signInSignUp/FormMall';
import { requestHandler} from '../helpers/requestHandler';
interface Props {
    
}
interface State{
    email:string,

}
export default class ContactPage extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
            this.state ={ 
            email:'',
   
          
        }
    }



    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
     
        let requestBody = {
            query: `
            mutation {
                createSubscription(SubscriptionInput: {email: "${this.state.email}"}) {
                  _id
                }
              }
              
            `
          };
       
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {
            data.createSubscription?this.setState({email:''},()=>{alert("You are subscribed now")}):this.setState({email:''},()=>{alert("Try with new email or something went wrong")});
          }
    }

    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({[event.target.type]:event.target.value } as Pick <State,any> )}
    
    render(){
        return(
            <div className="contactContainer">
                <div>

                <h1>Contact Us: </h1>
                <ul className="detailContainer">
                    <li>Tel: 0733466726</li>
                    <li>Address: Trollhättan, 456 34 Ab</li>
                    <li>Support: 0733466726</li>
                <img className={'supportImg'} src={process.env.PUBLIC_URL +`${support }`} alt={"main-view"}/>
                </ul>
                </div>
                    <FormNall>
                <div style={ul}>
                    <span>Get our latest news</span>
                    <form onSubmit={this.handleSubmit} style={ulDetail}>
           
                            <input className={"inputStyle"} type="email"  placeholder='email' onChange={this.handleOnChange} value={this.state.email}  required/>
                            
                       
                        <input type="submit" value='Submit'/>
                    </form>
                </div>
                    </FormNall>
    
            </div>
            
        )
    }
}

const ul:CSSProperties={
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
  
 
}
const ulDetail:CSSProperties={
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin:"auto"
  
  
 
}



