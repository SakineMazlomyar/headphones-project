import React,{CSSProperties} from 'react';
import Navbar from './navbar/Navbar';
import ViewContainer from './ViewContainer';
interface State {
    current_user:string
}
interface Props {

}
export default class Layout extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
            this.state = { 
            current_user:''
        
        }
    }

    componentDidMount(){
        let seletedUsers:any = localStorage.getItem("users");
    
        if( !seletedUsers ) {
            let users = localStorage.setItem("users","[]");

        } else {
            
            console.log(JSON.parse(seletedUsers))
        }
        this.checkForUser()
    }

  
      checkForUser = ()=>{
          console.log('here')
        let current_user :any = localStorage.getItem("current_user");
        let parsedCurrentUser:any = JSON.parse(current_user);
        if(current_user) {
            this.setState({current_user:parsedCurrentUser.username}, ()=>{console.log(this.state, 'here is state')})
        }

      }
      
      
    
    
    
      renderCurrentSignedInUser = ()=>{
     
        if(this.state.current_user !== '') {
            return <div>
                    <h4 className="nav-link"> Hej {this.state.current_user }</h4>
                    <button className="nav-link" onClick={this.signOut}>Sign Out</button>
                </div>
    
        } else {
            return ''
        }
    
      }
    
      signOut = () =>{
        localStorage.removeItem("current_user");
        this.setState({current_user:''})
        return ''
      }

    render(){
        return(
                
            <div>
                <Navbar signedInUser={this.renderCurrentSignedInUser} />
                <ViewContainer signedInUser={this.checkForUser}/>
            </div>
            
        )
    }
}




