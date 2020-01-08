import React,{Component } from 'react';
import FormMall from './FormMall';
import './form.css';
import { requestHandler,  loginHandler } from '../helpers/requestHandler';
import Admin from '../admin/admin';
interface CurrentUser {
  id:string,
  username:string,
  email:string
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
interface choosenShipper {
    _id:string,
    companyName:string,
    shippingPrice:number
    shippingMethod:string
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
    choosenShipper: {orderId:string, shipper:choosenShipper}
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
            current_orders_products:{id:'', products:[]},
            choosenShipper:{orderId:'', shipper:{_id:'', companyName:'', shippingPrice:0, shippingMethod:''}}
          
        }
    }

    /* 
    add func for updating a user password or delete a user
    add func if user is logged in do not show form else show form
    
    */
    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
     
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
          let data = await  loginHandler(requestBody);
          if(typeof data !== 'undefined') {

              data.createUser?alert('We created new user'):this.saveUser(data.login)
          }
    }

    saveUser = (user:{userId:string, email:string, username:string})=>{

      let users:any = localStorage.getItem("users");
      let parsetUsers = JSON.parse(users);
      /* Check if this user is already in locastorage */
     if(parsetUsers.length > 0 ) {
      localStorage.removeItem("current_user");
      localStorage.setItem("current_user", JSON.stringify({id:user.userId, username:user.username, email:user.email}));
      let existUser = false
        parsetUsers.filter((savedUser:any)=>{

          if(savedUser.email === user.email ) { existUser = true}
          
        })

        if(!existUser) {
          let sigendInUser = {id:user.userId, email:user.email, choosenProducts:[]}
          parsetUsers.push(sigendInUser)
          localStorage.setItem("users", JSON.stringify(parsetUsers))
        }
        alert('You are signed in')
     } else {
     
      let sigendInUser = {id:user.userId, email:user.email, choosenProducts:[]}
      parsetUsers.push(sigendInUser)
      let newLocatStorage = localStorage.setItem("users", JSON.stringify(parsetUsers));
      localStorage.setItem("current_user", JSON.stringify({id:user.userId, username:user.username}));
      alert('You are signed in')
     }
     this.props.signedInUser()
     this.setState({signOut:true, email:'', password:'', text:'' , current_user:user.username})
     
    }

    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({[event.target.type]:event.target.value } as Pick <State,any> )}
    handleLogout = () => { this.setState({ isLoggedIn: false })}
    handleLogin = () => { this.setState({ isLoggedIn: true })}
    
    renderSignInSignUp = ()=> {
        
      return this.state.isLoggedIn ? <button onClick={this.handleLogout}>Sign In</button>: <button onClick={this.handleLogin}>Sign Up</button>;
    }

    renderUsername = ()=> {
      if(this.state.isLoggedIn) {
        return '';

      } else {
        return ( <input className={"inputStyle"} type="text"  placeholder="name" onChange={this.handleOnChange} value={this.state.text} required/>)
      }
    }

    getCurrentOrders = async ()=> {
    if(this.props.userInfo.id !== '') {
      let requestBody = {
          query: `
          { getSpeceficOrder(_id: "${this.props.userInfo.id}") {
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
          }`
        };
  
        let data = await requestHandler(requestBody);
        typeof data !== 'undefined' ? this.setState({current_orders:data.getSpeceficOrder},()=>{ if(this.state.current_orders.length <=0){
          alert("You Have No Order Yet!")
        }}):this.setState({current_orders:[]})
        
        } 
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
            } `
          };
    
          let data = await requestHandler(requestBody);
          typeof data !== 'undefined' ? this.setState({current_orders_products: {id:id, products:data.getSpeceficOrderDetails}})
          :this.setState({current_orders_products:{id:'', products:[]}})
  
      }

    }
    showCurrentOrderProduct = ()=>{
        if(this.state.current_orders_products.products.length > 0) {
            return this.state.current_orders_products.products.map((product)=>{
                return <ul className={"itemOrderContainer"} >
                        <img className={"img-order"} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                        <li>{product.productName}</li>
                        <li>{product.unitPrice+ "SEK"}</li>
                        <li>total-köpt: {product.counted}</li>
                    </ul>
            })
        }
    }
    getChoosenShipper = async (id:string, orderId:string) => {
        if(this.props.userInfo.id !== '') {
          let requestBody = {
            query: `
            {   getSpeceficShipper(_id: "${id}") {
                  companyName
                  shippingPrice
                  shippingMethod
                }
              }`
          };
          let data = await requestHandler(requestBody);
          typeof data !== 'undefined' ? this.setState({choosenShipper:{orderId:orderId, shipper:data.getSpeceficShipper}},()=>{console.log(this.state.choosenShipper, 'gick bra')})
          :this.setState({choosenShipper:{orderId:'', shipper:{_id:'', shippingPrice:0, shippingMethod:'', companyName:''}}},()=>console.log(this.state.choosenShipper, 'her is gick inte bra'))
      
          }
    
    }
    displayChoosenShipper = ()=> {
        return <ul className={"orderContainer"}>
                    <li>{this.state.choosenShipper.shipper.companyName}</li>
                    <li>{this.state.choosenShipper.shipper.shippingMethod}</li>
                    <li>{this.state.choosenShipper.shipper.shippingPrice+ "SEK"}</li>
                </ul>
    }
    displayCurrentOrder = ()=> {
        if(this.state.current_orders.length > 0) {
            return this.state.current_orders.map((order)=>{
            return <ul className={"orderContainer"}>
                        One Order: 
                        <li>Name: {order.shipFirstName}</li>
                        <li>Lastname: {order.shipLastName}</li>
                        <li>Address: {order.shippAdress} Postnummer: {order.shippPostelCode} Stad: {order.shipCity}</li>
                        <li>Email: {order.shipMail}</li>
                        <li>Tel: {order.shipPhoneNo}</li>
                        <li>Date Created This Order: {order.orderDate}</li>
                        <button className={"orderButton"}  onClick={()=> this.showOrderDetails(order._id)}>Visa order details</button>
                        <div>{this.state.current_orders_products.id === order._id ? this.showCurrentOrderProduct():''}</div>
                        
                        
                        <button  className={"orderButton"} onClick={()=> this.getChoosenShipper(order.selectedShipper, order._id)}>Visa valt frakt</button>
                        {this.state.choosenShipper.orderId === order._id ? this.displayChoosenShipper():''}
                 </ul>
            })
        }
    }

    renderForm = ()=>{
        return (
          <FormMall>
            <h1>{this.state.isLoggedIn?'Sign In':'Sign Up!' }</h1>
              <label>Byt till {this.renderSignInSignUp()}</label>
          <form onSubmit={this.handleSubmit} className={"formStyle"}>
           
                  <input className={"inputStyle"} type="email"  placeholder='email' onChange={this.handleOnChange} value={this.state.email}  required/>
                  <input className={"inputStyle"} type="password"  placeholder="password" onChange={this.handleOnChange} value={this.state.password} required/>
                 {this.renderUsername()}
              <input type="submit" value='Submit'/>
          </form>
          </FormMall>
        )
    }

    renderCurrentUserInfo = () => {
      if(this.props.userInfo.id !== '' && this.props.userInfo.email !== "admin@gmail.com") {
        return (<div className={"orderContainer"}>
                 <button className={"orderButton"} onClick={this.getCurrentOrders}>Show All Orders! </button>
                 <div  className={"orderContainer"}>
                    {this.displayCurrentOrder()}
                 </div>
             
            </div>)
      } else if (this.props.userInfo.id !== '' && this.props.userInfo.email === "admin@gmail.com"){
        return <Admin />
      }else {
        return this.renderForm()
      }
    }

    render (){ return ( this.renderCurrentUserInfo() ) }
}
