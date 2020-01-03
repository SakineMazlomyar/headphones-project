import React,{CSSProperties} from 'react';
import { requestHandler } from '../helpers/requestHandler';
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
interface User {
    _id:string,
    username:string,
    email:string
  }
  interface Shipper {
    _id:string,
    companyName:string,
    shippingPrice:number
    shippingMethod:string
  }
interface State{
  
    orders:Order[],
    users:User[],
    shippers:Shipper[]
}

interface Props {

}
export default class Admin extends React.Component <Props, State>{
    constructor(props:Props){
        super(props);
            this.state = { 
                orders:[],
                users:[],
                shippers:[]
        }
    }


    getAllOrders = async ()=>{
        let requestBody = {
            query: `
            {
                orders {
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
       
          
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {

              this.setState({orders: data.orders}, ()=>{console.log(this.state.orders.length)})
          }
    }

    getAllUsers = async ()=>{
        let requestBody = {
            query: `
            {
                users {
                  _id
                  email
                  username
                }
              } 
              
            `
          };
       
          
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {

              this.setState({users: data.users}, ()=>{console.log(this.state.users.length)})
          }

    }
    getAllShipperMethods = async ()=>{
        let requestBody = {
            query: `{
                shippers {
                  _id
                  companyName
                  shippingPrice
                  shippingMethod
                }
              }`
          };
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {

              this.setState({shippers: data.shippers}, ()=>{console.log(this.state.shippers.length)})
          }

    }
    displayOrders = ()=> {
        if(this.state.orders.length > 0) {
        let orders =  this.state.orders.map((order)=>{
            return <ul className={"orderContainer"}>
                        Ett Besällning: 
                        <li>Namn: {order.shipFirstName}</li>
                        <li>Efternamn: {order.shipLastName}</li>
                        <li>Address: {order.shippAdress} Postnummer: {order.shippPostelCode} Stad: {order.shipCity}</li>
                        <li>Mail: {order.shipMail}</li>
                        <li>Tel: {order.shipPhoneNo}</li>
                        <li>Datum: {order.orderDate}</li>
                        {/* <button className={"orderButton"}  onClick={()=> this.showOrderDetails(order._id)}>Visa order details</button>
                        <div>{this.state.current_orders_products.id === order._id ? this.showCurrentOrderProduct():''}</div>
                        
                        
                        <button  className={"orderButton"} onClick={()=> this.getChoosenShipper(order.selectedShipper, order._id)}>Visa valt frakt</button>
                        {this.state.choosenShipper.orderId === order._id ? this.displayChoosenShipper():''} */}
                 </ul>
            })

            return <div>
            <button onClick={this.hideOrder}>Gömma Alla Beställningar!</button>
            {orders}
            </div>  
        }
    }
    displayShippers = ()=> {
        if(this.state.shippers.length > 0 ) {
            let shippers = this.state.shippers.map((shipper)=>{
                return <ul className={"orderContainer"}>
                    <li>{shipper.companyName}</li>
                    <li>{shipper.shippingMethod}</li>
                    <li>{shipper.shippingPrice+ "SEK"}</li>
                </ul>
            })
            return <div>
            <button onClick={this.hideShipper}>Gömma Alla Leverans Methoder!</button>
            {shippers}
            </div>  
        }
    }
    hideOrder = ()=>{ this.setState({ orders:[]})}
    hideUser= ()=>{ this.setState({ users:[]})}
    hideShipper= ()=>{ this.setState({ shippers:[]})}
    displayUsers = ()=> {
        if(this.state.users.length > 0 ) {
            let users =  this.state.users.map((user)=>{
                return <ul className={"orderContainer"}>
                    <li>{user._id}</li>
                    <li>{user.email}</li>
                    <li>{user.username}</li>
                </ul>
            })
            return <div>
            <button onClick={this.hideUser}>Gömma Alla Anvädare!</button>
            {users}
            </div>  
        }
       
    }

    


   
    render(){
        return(
            <div style={adminContainer}>
                <h1>Hej Admin</h1>
                <button onClick={this.getAllOrders}>Visa Alla Beställningar Från Alla Användare!</button>
                {this.displayOrders()}
                <button onClick={this.getAllUsers}>Visa Alla Användare!</button>
                {this.displayUsers()}
                <button onClick={this.getAllShipperMethods}>Visa Alla Levernans Methoder!</button>
                {this.displayShippers()}
                {/* 
                
                create and remove shhipper and product
                
                */}
                
                 
            </div>
            
        )
    }
}


const adminContainer:CSSProperties ={
    display:"flex",
    flexDirection:"column"
}

