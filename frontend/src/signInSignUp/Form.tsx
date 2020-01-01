import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';
import FormMall from './FormMall';
import ShoppingCard from '../shoppingCard/shoppingCard';
interface CurrentUser {
  id:string,
  username:string
}
interface Props {

  
    signedInUser:()=>void,
    userInfo: CurrentUser

}
interface  Order {
    _id:string,
    shipFirstName: string,
    shipLastName: string,
    shippAdress: string,
    shippPostelCode: string,
    shipCity: string,
    shipMail: string,
    shipPhoneNo: string,
    totalPrice: number,
    orderDate: string,
    createdOrder: string,
    selectedShipper: string,
    createdAt: string,
    updatedAt: string
    
}

interface Product {
    _id: string,
    productName:string,
    unitInStock: number,
    unitPrice: number,
    pictureUrl: string,
    counted:number
}
interface State{
    email:string,
    password:string,
    isLoggedIn:boolean,
    text:string,
    signOut: boolean,
    current_user:string,
    current_orders:Order[],
    current_orders_products:{id:string, products:Product[]}
 

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
            current_user:'',
            current_orders:[],
            current_orders_products:{id:'', products:[]}
          
        
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
        return ( <input style={inputStyle} type="text"  placeholder="name" onChange={this.handleOnChange} value={this.state.text} required/>)
      }
    }

    getCurrentOrders = async ()=> {
    if(this.props.userInfo.id !== '') {
    
      let requestBody = {
          query: `
          {
            getSpeceficOrder(_id: "${this.props.userInfo.id}") {
              _id
              shipFirstName
              shipLastName
              shippAdress
              shippPostelCode
              shipCity
              shipMail
              shipPhoneNo
              totalPrice
              orderDate
              createdOrder
              selectedShipper
              createdAt
              updatedAt
            }
          }
          
          `
        };
  
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
              throw new Error('Request Failed at getting this order'+ res.status)
          } else {
            actuResponse.data.getSpeceficOrder !== null || actuResponse.data.getSpeceficOrder !== undefined ? this.setState({current_orders:actuResponse.data.getSpeceficOrder},()=>console.log(this.state.current_orders)):this.setState({current_orders:[]})
            
          }
  
  
        } catch(err){
           console.log("Error at getting current order "+err)
        }

    }
    }

    renderForm = ()=>{
        return (
          <FormMall>
          
            <h1>{this.state.isLoggedIn?'Sign In':'Sign Up!' }</h1>
              <label>Byt till {this.renderSignInSignUp()}</label>

          <form onSubmit={this.handleSubmit} style={formtStyle}>
           
                  <input style={inputStyle} type="email"  placeholder='email' onChange={this.handleOnChange} value={this.state.email}  required/>
                  <input style={inputStyle} type="password"  placeholder="password" onChange={this.handleOnChange} value={this.state.password} required/>
            
                 {this.renderUsername()}
              <input type="submit" value='Submit'/>
          </form>
      
          </FormMall>

        )
    }

    showOrderDetails = async (id:string) => {
      if(this.props.userInfo.id !== '') {
    
        let requestBody = {
            query: `
            {
              getSpeceficOrderDetails(_id: "${id}") {
                productName
                pictureUrl
                unitInStock
                unitPrice
                counted
                
              }
            }
            
            `
          };
    
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
                throw new Error('Request Failed at getting this order'+ res.status)
            } else {
              console.log(actuResponse, 'here is orderDetails')
             actuResponse.data.getSpeceficOrderDetails !== null || actuResponse.data.getSpeceficOrderDetails  !== undefined ? this.setState({current_orders_products: {id:id, products:actuResponse.data.getSpeceficOrderDetails}},()=>console.log(this.state.current_orders_products)):this.setState({current_orders_products:{id:'', products:[]}})
              
            }
    
    
          } catch(err){
             console.log("Error at getting current order "+err)
          }
  
      }

    }
    showCurrentOrderProduct = ()=>{
        if(this.state.current_orders_products.products.length > 0) {
            return this.state.current_orders_products.products.map((product)=>{
                console.log(product, 'here is pro')
                return <ul style={orderStyle}>
            <li>{product.productName}</li>
            <li>{product.unitPrice+ "SEK"}</li>
            <li>total-köpt: {product.counted}</li>
            <img style={productImgSize}className={'img'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                </ul>
            })
        }
    }
    showChoosenShipper = (id:string)=>{
        console.log(id)
    }
    displayCurrentOrder = ()=>{
        if(this.state.current_orders.length > 0) {
            return this.state.current_orders.map((order)=>{
            return <ul style={orderStyle}>
                        Ett Besällning: 
                        <li>Namn: {order.shipFirstName}</li>
                        <li>Efternamn: {order.shipLastName}</li>
                        <li>Address: {order.shippAdress} Postnummer: {order.shippPostelCode} Stad: {order.shipCity}</li>
                        <li>Mail: {order.shipMail}</li>
                        <li>Tel: {order.shipPhoneNo}</li>
                        <li>Datum: {order.orderDate}</li>
                        <button style={orderButton} onClick={()=> this.showOrderDetails(order._id)}>Visa order details</button>
                        <div>{this.state.current_orders_products.id === order._id ? this.showCurrentOrderProduct():''}</div>
                        <button  style={orderButton} onClick={()=> this.showChoosenShipper(order.selectedShipper)}>Visa valt frakt</button>
                 </ul>
            })
        }
    }
    renderCurrentUserInfo = ()=>{
      if(this.props.userInfo.id !== '') {
        return (<div style={orderContainer}>

                 <button style={orderButton}onClick={this.getCurrentOrders}>Visa Alla Beställningar </button>
                 <div  style={orderContainer}>
                    {this.displayCurrentOrder()}
                 </div>
             
            </div>)
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



const inputStyle: CSSProperties = {
  margin:"1em"
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

const orderStyle:CSSProperties ={
    display: "flex",
    flexDirection:"column"
}


const orderContainer:CSSProperties = {
    display: "flex",
    flexDirection:"column"
}

const orderButton:CSSProperties = {
    width:"30%",
    backgroundColor: "green"
}

const productImgSize:CSSProperties = {
    width:"25%"
}