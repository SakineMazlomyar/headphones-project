import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';

interface Props {

    isLoggedin:(user:{email:string, userId:string,isLoggedIn:boolean})=>void

}

interface State{
    email:string,
    password:string,
    isLoggedIn:boolean,
    signUpOrSignIn:string

}


export default class Form extends Component<Props,State>{
    constructor(props:Props){
        super(props);
            this.state ={ 
            email:'',
            password:'',
            isLoggedIn:false,
            signUpOrSignIn:"Please Sign Up!"
        
        }
    }

    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(this.state)
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
              if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
              } else if(actuResponse.data.createUser === null){
                  console.log('it is here')
                  console.log(actuResponse)
                  this.setState({isLoggedIn:true}, ()=>console.log(this.state))
                alert(actuResponse.errors[0].message)
              } else {
                  console.log (actuResponse.data);
              }


          } catch(error){
            throw new Error ('Error at create use '+ error)
          }
          

    }





    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({[event.target.type]:event.target.value } as Pick <State,any> )
        
        
    }

    switchToLogin = ()=>{
        if(this.state.isLoggedIn) {
            this.setState({signUpOrSignIn:"Sign In Please!"})
        }
    }
    



    render(){
        return(
            <form onSubmit={this.handleSubmit} style={formtStyle}>
                <h1>Create User </h1>
                <label htmlFor="text" style={input}>
                    Ange ditt email: 
                    <input type="email"  placeholder='email' onChange={this.handleOnChange} required/>
                </label>
                
                <label htmlFor="text">
                    Ange ditt password: <input type="password"  placeholder="password" onChange={this.handleOnChange} required/>
                </label>
                <input type="submit" value={this.state.signUpOrSignIn}/>
                {this.switchToLogin()}
            </form>

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



