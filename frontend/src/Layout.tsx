import React,{CSSProperties} from 'react';
import Navbar from './navbar/Navbar';
import ViewContainer from './ViewContainer';
import Footer from './footer/footer';
interface CurrentUser {
    id:string,
    username:string,
    email:string
}
interface State {
    current_user:CurrentUser,
    amount:number,
    totalPrice:number
  
}
interface Props {

}
export default class Layout extends React.Component<Props, State>{
  
    constructor(props:Props){
        super(props);
            this.state = { 
            current_user:{id:'', username:'', email:''},
            amount:0,
            totalPrice:0
           
        
        }

  
    }

    componentDidMount(){
        let selectedUsers:any = localStorage.getItem("users");
        let currentShoppingCard:any = localStorage.getItem("shoppingcart");
     
        selectedUsers === null || selectedUsers === false ? localStorage.setItem("users","[]"):'';
        currentShoppingCard === null ||currentShoppingCard === false ? localStorage.setItem("shoppingcart",JSON.stringify([])): '';

        this.checkForUser()
    }

  
      checkForUser = ()=>{
       
        let current_user :any = localStorage.getItem("current_user");
        let parsedCurrentUser:any = JSON.parse(current_user);
        if(current_user) {
            this.setState({current_user:{username:parsedCurrentUser.username, id:parsedCurrentUser.id, email:parsedCurrentUser.email}})
        }

      }
      
      
    
    
    
      renderCurrentSignedInUser = ()=>{
     
        if(this.state.current_user.id !== '') {
            return <div>
                    <h4 className="nav-link"> Hej {this.state.current_user.username }</h4>
                    <button className="nav-link" onClick={this.signOut}>Sign Out</button>
                </div>
    
        } else {
            return ''
        }
    
      }
    
      signOut = () =>{
        localStorage.removeItem("current_user");
        this.setState({current_user:{id:'', username:'', email:''}})
        return ''
      }

      getAddedProducts = (products:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>{
     
        //return products
        let initTolatlPrice = 0
        for(let product of products) {
            let price = product.unitPrice
         
            initTolatlPrice += price
        }
        this.setState({amount:products.length, totalPrice:initTolatlPrice})

    }



    render(){
        return(
                
            <div>
                <Navbar signedInUser={this.renderCurrentSignedInUser} amount={this.state.amount}/>
                <ViewContainer 
                signedInUser={this.checkForUser}
                userInfo={this.state.current_user}
                getAddedProducts={this.getAddedProducts}
                totalPrice={this.state.totalPrice}
                amount={this.state.amount}
                />
             
            </div>
            
        )
    }
}




