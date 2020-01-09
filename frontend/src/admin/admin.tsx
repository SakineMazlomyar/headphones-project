import React,{CSSProperties} from 'react';
import { requestHandler } from '../helpers/requestHandler';
import ProductForm from '../product-form/product-form';
import ShipperForm  from '../shipper-form/shipper-form';
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
interface Product {
    productName: string,
    _id:string,
    unitPrice:number,
    unitInStock:number,
    pictureUrl:string,
    description:string
}
  
interface ProductUser {
    productName: string,
    _id:string,
    unitPrice:number,
    unitInStock:number,
    pictureUrl:string,
    description:string,
    counted:number
}
interface choosenShipper {
    _id:string,
    companyName:string,
    shippingPrice:number
    shippingMethod:string
  }
interface State{
  
    orders:Order[],
    users:User[],
    shippers:Shipper[],
    showProductForm:boolean,
    showShipperForm:boolean,
    products:Product[],
    modified:Product,
    modifiedProdcut:boolean,
    modifiedShipper:Shipper,
    modifiedShipp:boolean,
    choosenShipper: {orderId:string, shipper:choosenShipper},
    current_orders_products:{id:string, products: ProductUser[]}

}

interface Props {

}
export default class Admin extends React.Component <Props, State>{
    constructor(props:Props){
        super(props);
            this.state = { 
                orders:[],
                users:[],
                shippers:[],
                showProductForm:false,
                showShipperForm:false,
                products:[],
                modified:{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:"", description:""},
                modifiedProdcut:false,
                modifiedShipper:{ _id:'', companyName:'', shippingPrice:0, shippingMethod:''},
                modifiedShipp:false,
                choosenShipper:{orderId:'', shipper:{_id:'', companyName:'', shippingPrice:0, shippingMethod:''}},
                current_orders_products:{id:'', products:[]},
        }
    }

    /* Visa alla produkter och kunna modifera quantity */
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
            query: `{ users {
                  _id
                  email
                  username
                }
              } `
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
                     this.setState({shippers: data.shippers}, ()=>{
                         if(this.state.shippers.length <= 0) {
                             alert('There is not shipper Method')
                         }
                     })
               }else {
                   this.setState({shippers: []})
               }
        
    }
    getAllProducts = async ()=>{
        let requestBody = {
            query: `{ products {
                productName
                _id
                unitPrice
                unitInStock
                pictureUrl 
                description
                }
            }`
            };
        
        let data = await  requestHandler(requestBody);
        typeof data !== 'undefined' ? this.setState({products:data.products}): this.setState({products:[]})
        
    }
    showOrderDetails = async (id:string) => {
      
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
        console.log(data, 'here is shipper data')
        typeof data !== 'undefined' ? this.setState({choosenShipper:{orderId:orderId, shipper:data.getSpeceficShipper}},()=>{console.log(this.state.choosenShipper, 'gick bra')})
        :this.setState({choosenShipper:{orderId:'', shipper:{_id:'', shippingPrice:0, shippingMethod:'', companyName:''}}},()=>console.log(this.state.choosenShipper, 'her is gick inte bra'))
    
        
    
    }
    displayChoosenShipper = ()=> {
        return <ul className={"orderContainer"}>
                    <li>{this.state.choosenShipper.shipper.companyName}</li>
                    <li>{this.state.choosenShipper.shipper.shippingMethod}</li>
                    <li>{this.state.choosenShipper.shipper.shippingPrice+ "SEK"}</li>
                </ul>
    }


    
    displayOrders = ()=> {
        if(this.state.orders.length > 0) {
            console.log(this.state.orders)
        let orders =  this.state.orders.map((order)=>{
            return <ul className={"orderContainer"}>
                        One Order: 
                        <li>Id: {order._id}</li>
                        <li>Namn: {order.shipFirstName}</li>
                        <li>Efternamn: {order.shipLastName}</li>
                        <li>Address: {order.shippAdress} Postnummer: {order.shippPostelCode} Stad: {order.shipCity}</li>
                        <li>Mail: {order.shipMail}</li>
                        <li>Tel: {order.shipPhoneNo}</li>
                        <li>Datum: {order.orderDate}</li>
                        <button className={"orderButton"}  onClick={()=> this.showOrderDetails(order._id)}>Visa order details</button>
                        <div>{this.state.current_orders_products.id === order._id ? this.showCurrentOrderProduct():''}</div>
                        
                        
                        <button  className={"orderButton"} onClick={()=> this.getChoosenShipper(order.selectedShipper, order._id)}>Visa valt frakt</button>
                        {this.state.choosenShipper.orderId === order._id ? this.displayChoosenShipper():''}
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
                    <li>{shipper._id}</li>
                    <li>{shipper.companyName}</li>
                    <li>{shipper.shippingMethod}</li>
                    <li>{shipper.shippingPrice+ "SEK"}</li>
                    <button onClick={()=> this.updateThisShipper(shipper)}>Update This shipper Method</button>
                    <button onClick={()=> this.deleteThisShipper(shipper)}>Delete This Shipper</button>
                </ul>
            })
            return <div>
            <button onClick={this.hideShipper}>Gömma Alla Leverans Methoder!</button>
            {shippers}
            </div>  
        }
    }
    hideOrder = ()=>{ this.setState({ orders:[]})};
    hideUser= ()=>{ this.setState({ users:[]})};
    hideShipper= ()=>{ this.setState({ shippers:[]})};
    showProductForm = ()=>{this.setState({ showProductForm:true})};
    hideProduktForm = ()=>{this.setState({ showProductForm:false, modifiedProdcut:false, modified:{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:"", description:""}})};
    showShipperForm = ()=>{this.setState({ showShipperForm:true})};
    hideShipperForm = ()=>{this.setState({ showShipperForm:false,   modifiedShipp:false, modifiedShipper:{_id:'', companyName:'', shippingPrice:0, shippingMethod:''}})};
    hideProducts = ()=>{this.setState({ products:[]})};
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
    displayProduktForm = ()=> {
        if(this.state.showProductForm === true || this.state.modifiedProdcut === true) {

            return (<div>
                     <button onClick={this.hideProduktForm}>Gömma Produkts Formen!</button>
                    <ProductForm  modified={this.state.modified}/>
                </div>)
        }
    }
    updateThisShipper = async (shipper: {_id:string, companyName:string, shippingPrice:number, shippingMethod:string})=>{
        this.setState({
            modifiedShipper:{_id:shipper._id,
            companyName:shipper.companyName,
            shippingPrice:shipper.shippingPrice,
            shippingMethod:shipper.shippingMethod},
            modifiedShipp:true,
            shippers:[]
            });
        
    }
    displayShipperForm = ()=> {
        if(this.state.showShipperForm === true || this.state.modifiedShipp === true) {

            return (<div>
                     <button onClick={this.hideShipperForm}>Gömma Leverans Methoder Formen!</button>
                    <ShipperForm modified={this.state.modifiedShipper} getAllShipperMethods={this.getAllShipperMethods}/>
                </div>)
        }
    }

    modifyChoosenProduct = async (product:{productName: string, _id:string, unitPrice:number, unitInStock:number,pictureUrl:string, description:string})=>{
        this.setState({
            modified:{productName: product.productName, _id:product._id,unitPrice:product.unitPrice, 
              unitInStock:product.unitInStock,
              pictureUrl:product.pictureUrl, description:product.description},
              modifiedProdcut:true,
              products:[]
            });
        
    }
    removeThisProduct = async (product:{productName: string, _id:string, unitPrice:number, unitInStock:number,pictureUrl:string, description:string})=>{
        console.log(product._id)
        let requestBody = {
            query: `
            mutation {
                deleteProduct(ProductDelete: {_id: "${product._id}"}) {
                    ok
                    n
                    deletedCount
                }
              }
              
            `
          };
        
        let data = await  requestHandler(requestBody);
        console.log(data)
        typeof data !== 'undefined' ? 

        this.getAllProducts().then(()=>{
          
            alert(data.deleteProduct.n) 
        }) 
        :alert("We could not remove this product")
        
    }
    deleteThisShipper  = async (shipper:{_id:string, companyName:string, shippingPrice:number, shippingMethod:string})=>{
        
        let requestBody = {
            query: `
            mutation {
                deleteShipper(ShipperDelete: {_id: "${shipper._id}"}) {
                  ok
                  n
                  deletedCount
                }
              }
              
            `
          };
        
        let data = await  requestHandler(requestBody);
        console.log(data)
        typeof data !== 'undefined' ? this.getAllShipperMethods().then(()=>{
            alert(data.deleteShipper.n) 
        }):alert("We could not remove this shipper")
        
    }
    displayProduct = ()=>{
        if(this.state.products.length > 0) {
            let products =  this.state.products.map((product)=>{
                

                return <ul className={"orderContainer"}>
                    <span>En Produkt: </span>
                    <li>{product._id}</li>
                    <li>{product.productName}</li>
                    <li>{product.pictureUrl}</li>
                    <li>Total UnitInStock: {product.unitInStock}</li>
                    <li>{product.unitPrice+ " SEK"}</li>
                    <li>{product.description }</li>
                    <button onClick={()=>this.modifyChoosenProduct(product)}>Modify This produkt</button>
                    <button onClick={()=>this.removeThisProduct(product)}>Remove This produkt</button>
                </ul>
                
            })
            return <div>
            <button onClick={this.hideProducts}>Gömma Alla Produkter!</button>
            {products}
            </div>  
        }
    }


   
    render(){
        return(
            <div style={adminContainer}>
                <h1>Hej Admin</h1>
                <button style={item} onClick={this.showProductForm}>Skapa En Produkt/update</button>
                {this.displayProduktForm()}
                <button style={item} onClick={this.showShipperForm}>Skapa En Leverans Method/update</button>
                {this.displayShipperForm()}
                <button style={item} onClick={this.getAllProducts}>Visa Alla produkter</button>
                {this.displayProduct()}
                <button style={item} onClick={this.getAllOrders}>Visa Alla Beställningar Från Alla Användare!</button>
                {this.displayOrders()}
                <button style={item} onClick={this.getAllUsers}>Visa Alla Användare!</button>
                {this.displayUsers()}
                <button style={item} onClick={this.getAllShipperMethods}>Visa Alla Levernans Methoder!</button>
                {this.displayShippers()}
                 
            </div>
            
        )
    }
}


const adminContainer:CSSProperties ={
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-around"
}
const item:CSSProperties ={
   margin:"1em"
}


