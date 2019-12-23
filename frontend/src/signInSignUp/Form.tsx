import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';

interface Props {

    isLoggedin:(user:{email:string, userId:string,isLoggedIn:boolean})=>void

}

interface State{
    email:string,
    password:string,
    isLoggedIn:boolean,
 

}


export default class Form extends Component<Props,State>{
    constructor(props:Props){
        super(props);
            this.state ={ 
            email:'',
            password:'',
            isLoggedIn:false,
          
        
        }
    }

    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
     
        let requestBody = {
            query: `
              query {
                login(email: "${this.state.email}", password: "${this.state.password}") {
                  userId
                  email
                }
              }
            `
          };
       
          if (!this.state.isLoggedIn) {
            requestBody = {
              query: `
                mutation {
                  createUser(UserInput: {email: "${this.state.email}", password: "${this.state.password}"}) {
                    _id
                    email
                  }
                }
              `
            };
          }
          try  {
            let res = await Axios({
                url:'/graphql',
                method: 'POST',
                data: JSON.stringify(requestBody),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              
              let actuResponse = await res.data;
            
            
            if (res.status !== 200) {
                //When user insert wrong info we send it catch
                throw new Error('Request Failed '+ res.status)
            } else if(actuResponse.data.createUser === null || actuResponse.data === null) {
                //When use insert the same email to create a new user
                alert(actuResponse.errors[0].message);
            } else if(actuResponse.errors) {
                  console.log (actuResponse);
                  alert('Error at sign in!')
            } else {
              //this.props.isLoggedin(actuResponse.data.login)
                actuResponse.data.createUser?alert('We created new user'): alert('You are logged in now')
            }


          } catch(err){
            alert('Wrong info!Try again!')
             console.log(err)
          }
          

    }





    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({[event.target.type]:event.target.value } as Pick <State,any> )
        
        
    }

    handleLogout = () => { this.setState({ isLoggedIn: false })}
    handleLogin = () => { this.setState({ isLoggedIn: true })}
    
    renderSignInSignUp = ()=> {
        
      return this.state.isLoggedIn ? <button onClick={this.handleLogout}>Sign In</button>: <button onClick={this.handleLogin}>Sign Up</button>;
  }



    render(){
    
        return(
            <div style={formtStyle}>
              <h1>{this.state.isLoggedIn?'Sign In':'Sign Up!' }</h1>
                <label>Byt till {this.renderSignInSignUp()}</label>

            <form onSubmit={this.handleSubmit} style={formtStyle}>
                <label htmlFor="text" style={input}>
                    Ange ditt email: 
                    <input type="email"  placeholder='email' onChange={this.handleOnChange} required/>
                </label>
                
                <label htmlFor="text">
                    Ange ditt password: <input type="password"  placeholder="password" onChange={this.handleOnChange} required/>
                </label>
                <input type="submit" value='Submit'/>
            </form>
            </div>

        )
    }
}

const formtStyle: CSSProperties ={
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    margin:"auto",
    width:"50%",
    marginTop:"3em",
    padding:"1em",
    backgroundColor:"#d7e4c7"
}
const input: CSSProperties={
    margin:"1em"
}



