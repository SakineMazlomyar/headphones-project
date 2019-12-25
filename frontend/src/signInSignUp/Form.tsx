import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';

interface CurrentUser {
  id:string,
  username:string
}
interface Props {

  
    signedInUser:()=>void,
    userInfo: CurrentUser

}

interface State{
    email:string,
    password:string,
    isLoggedIn:boolean,
    text:string,
    signOut: boolean,
    current_user:string
 

}


export default class Form extends Component<Props,State>{
    constructor(props:Props){
        super(props);
            this.state ={ 
            email:'',
            password:'',
            isLoggedIn:false,
            text:'',
            signOut:false,
            current_user:''
          
        
        }
    }

    /* 
    add func for updating a user password or delete a user
    add func if user is logged in do not show form else show form
    
    */


    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
      console.log(this.state)
        let requestBody = {
            query: `
              query {
                login(email: "${this.state.email}", password: "${this.state.password}") {
                  userId
                  email
                  username
                }
              }
            `
          };
       
          if (!this.state.isLoggedIn) {
            requestBody = {
              query: `
                mutation {
                  createUser(UserInput: {email: "${this.state.email}", password: "${this.state.password}", username:"${this.state.text}"}) {
                    _id
                    email
                    username
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
                actuResponse.data.createUser?alert('We created new user'):this.saveUser(actuResponse.data.login)
            }


          } catch(err){
            alert('Wrong info!Try again!')
             console.log(err)
          }
          

    }

    saveUser = (user:{userId:string, email:string, username:string})=>{
      console.log(user)
      let users:any = localStorage.getItem("users");
      let parsetUsers = JSON.parse(users);
      /* Check if this user is already in locastorage */
     if(parsetUsers.length > 0 ) {
       console.log('0')
      localStorage.removeItem("current_user");
      localStorage.setItem("current_user", JSON.stringify({id:user.userId, username:user.username}));
      let existUser = false
        parsetUsers.filter((savedUser:any)=>{

          if(savedUser.email === user.email ) {
            console.log(savedUser.email, user.email)
            existUser = true
           
             
          }
          
        })

        if(!existUser) {
          let sigendInUser = {id:user.userId, email:user.email, choosenProducts:[]}
          parsetUsers.push(sigendInUser)
          localStorage.setItem("users", JSON.stringify(parsetUsers))
        }
    
            
        alert('You are signed in')
     } else {
       console.log('1')
      let sigendInUser = {id:user.userId, email:user.email, choosenProducts:[]}
      parsetUsers.push(sigendInUser)
      let newLocatStorage = localStorage.setItem("users", JSON.stringify(parsetUsers));
      console.log(newLocatStorage)
      localStorage.setItem("current_user", JSON.stringify({id:user.userId, username:user.username}));
      alert('You are signed in')
     }
     this.props.signedInUser()
     this.setState({signOut:true, email:'', password:'', text:'' , current_user:user.username})
     
    }

    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({[event.target.type]:event.target.value } as Pick <State,any> )
        
        
    }

    handleLogout = () => { this.setState({ isLoggedIn: false })}
    handleLogin = () => { this.setState({ isLoggedIn: true })}
    
    renderSignInSignUp = ()=> {
        
      return this.state.isLoggedIn ? <button onClick={this.handleLogout}>Sign In</button>: <button onClick={this.handleLogin}>Sign Up</button>;
    }

    renderUsername = ()=> {
      if(this.state.isLoggedIn) {
        return '';

      } else {
        return (
        <label htmlFor="text">
            Ange ditt nam: <input type="text"  placeholder="name" onChange={this.handleOnChange} value={this.state.text} required/>
        </label>
        )
      }
    }

    renderForm = ()=>{
        return (

            <div style={formtStyle}>
            <h1>{this.state.isLoggedIn?'Sign In':'Sign Up!' }</h1>
              <label>Byt till {this.renderSignInSignUp()}</label>

          <form onSubmit={this.handleSubmit} style={formtStyle}>
              <label htmlFor="text" style={input}>
                  Ange ditt email: 
                  <input type="email"  placeholder='email' onChange={this.handleOnChange} value={this.state.email}  required/>
              </label>
              
              <label htmlFor="text">
                  Ange ditt password: <input type="password"  placeholder="password" onChange={this.handleOnChange} value={this.state.password} required/>
              </label>
                 {this.renderUsername()}
              <input type="submit" value='Submit'/>
          </form>
          </div>

        )
    }

    renderCurrentUserInfo = ()=>{
      if(this.props.userInfo.id !== '') {
        return <h1>Here is current orders</h1>
      } else {
        return this.renderForm()
      }
    }





    render(){
        return (

           this.renderCurrentUserInfo()
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



