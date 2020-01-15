import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';
import FormMall from '../signInSignUp/FormMall';
import { Link } from 'react-router-dom';
import { changeUrl } from '../helpers/requestHandler';
interface CurrentUser {
    id:string,
    username:string
    email:string
}

interface Props {

totalPrice:number,
userInfo:CurrentUser
}

interface Shipper {
    _id:string,
    companyName:string,
    shippingPrice:number,
    shippingMethod:string
}
interface State{
    shipFirstName:String,
    shipLastName:String,
    shippAdress:String,
    shippPostelCode:string,
    shipCity:String,
    email:String,
    tel:String,
    totalPrice:any,
    orderDate:String,
    createdOrder:string,
    selectedShipper:string
    shippers:Shipper[]
 

}

export default class CheckOut extends Component<Props,State>{
    constructor(props:Props){
        super(props);
            this.state = { 
                shipFirstName:'',
                shipLastName:'',
                shippAdress:'',
                shippPostelCode:'',
                shipCity:'',
                email:'',
                tel:'',
                totalPrice:0,
                orderDate:'',
                createdOrder:'',
                selectedShipper:'',
                shippers:[]
        
        }
    }

    componentDidMount() {
        this.getShipperMethods();
        let createdOrder = new Date().toISOString();
        this.handleOrderDate(createdOrder);
        this.handleOrderPrice(); 
       
    }

    getShipperMethods = async ()=> {
        let requestBody = {query:`
            { shippers {
            _id
            shippingMethod
            shippingPrice,
            companyName
            }
        }`};
        
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
          actuResponse.data.shippers !== false ? this.setState({shippers: actuResponse.data.shippers}): this.setState({shippers:[]})
          
        } catch(err){
           console.log("Error at getting shippers"+err)
        }
    }

    handleSubmit=  (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       this.setState({createdOrder:this.props.userInfo.id}, async()=>{
  
           if(this.state.createdOrder === '') {
               alert('Sign In First!')
           } else { 
          
             let shoppingCart:any = localStorage.getItem("shoppingcart");
             let parsedShoppingCart = JSON.parse(shoppingCart);
             let productIds:string[] = [];
             let choosenProducts = parsedShoppingCart.map((item:{ productName: string, _id:string, unitPrice: number, unitInStock: number, pictureUrl:string})=>{
                 productIds.push(item._id)
                     
                 return {"name":item.productName, "sku":"item", "price":item.unitPrice.toString() +'.'+'00', "currency":"SEK", "quantity":1}
             })
     
                if(productIds.length <= 0) {
                    alert("Select Product First")
                } else {
                    let current_order = {
                        items:choosenProducts,
                        productIds:productIds,
                        shipFirstName:this.state.shipFirstName,
                        shipLastName:this.state.shipLastName,
                        shippAdress:this.state.shippAdress,
                        shippPostelCode:this.state.shippPostelCode,
                        shipCity:this.state.shipCity,
                        email:this.state.email,
                        tel:this.state.tel,
                        totalPrice:this.state.totalPrice,
                        orderDate:this.state.orderDate,
                        createdOrder:this.state.createdOrder,
                        selectedShipper:this.state.selectedShipper === ''?this.state.shippers[0]._id:this.state.selectedShipper,
                       }
                   try  {
                     let res = await Axios({
                         url:'/pay2',
                         method: 'POST',
                         data: JSON.stringify(current_order),
                         headers: {
                           'Content-Type': 'application/json'
                         }
                       })
                       
                     let actuResponse = await res.data;
                     window.location.assign(actuResponse.url)
                     localStorage.setItem("shoppingcart",JSON.stringify([]))
                  
                   } catch(err){
                      console.log("Error at posting orders"+err)
                   }
           
                }
           }
       })
     
    }
    



    handleFirstName = (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipFirstName:event.target.value }) }
    handleLastName= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipLastName:event.target.value }) }
    handleAddresss= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shippAdress:event.target.value }) }
    handleShipperPostalconde= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shippPostelCode:event.target.value }) }
    handleShipperCity= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipCity:event.target.value }) }
    handleEmailAndPhone = (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({[event.target.type]:event.target.value } as Pick<State, any>) }
    handleOrderDate = (createdOrder:string)=>{ this.setState({orderDate:createdOrder}) }
    

   
    handleOrderPrice = ()=>{ 
        let totalPrice = this.props.totalPrice;

        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);

            let initTolatlPrice = 0
            for(let product of parsedShoppingCart) {
                let price = product.unitPrice
            
                initTolatlPrice += price
            }
        let finalTotalPrice = totalPrice === 0?  initTolatlPrice: totalPrice
        this.setState({totalPrice: finalTotalPrice}
        
    ) }

    handleSelectShipper = (event: any)=>{ 
        this.setState({selectedShipper:event.target.value}) }

    
    renderShippers = ()=>{
        if(this.state.shippers.length > 0) {

            return this.state.shippers.map((shipper:{_id:string ,companyName:string ,shippingPrice:number,shippingMethod:string})=>{

            return <option value={shipper._id}>{
                `${shipper.companyName} ${shipper.shippingMethod} ${shipper.shippingPrice}SEK`}</option>
            })
           
        }
    }
   
    render(){
        return (
            <FormMall>
                <span>Welcome To Checkout </span>
                <form onSubmit={this.handleSubmit} style={formtStyle}>
                    <label><i className="fa fa-user"></i> Userrname</label>
                    <input type="text" id="fname" name="firstname" placeholder="Sven" onChange={this.handleFirstName} required />

                    <label ><i className="fa fa-user"></i> Lastname</label>
                    <input type="text" id="lname" name="lastname" placeholder="Svensson" onChange={this.handleLastName} required/>

                    <label><i className="fa fa-envelope"></i> Email</label>
                    
                    <input type="email" id="email" name="email" placeholder="john@example.com" onChange={this.handleEmailAndPhone } required/>
                    <label><i className="fa fa-home"></i> Address</label>
                    <input type="text" id="adr" name="address" placeholder="Svenssongatan 14a" onChange={this.handleAddresss} required/>

                    <label> City</label>
                    <input type="text" id="city" name="city" placeholder="Goteborg" onChange={this.handleShipperCity} required/>

                    <label><i className="fa fa-institution"></i> Postal code</label>
                    <input type="text" id="postalcode" name="postalcode" placeholder="43350" onChange={this.handleShipperPostalconde} required />

                    <label> Phone</label>
                    <input type="tel" id="shipPhoneNO" name="shipPhoneNO" placeholder="1212" onChange={this.handleEmailAndPhone } required/>

                    <label> Total Price In Sek</label>
                    <h5>{this.state.totalPrice} kr</h5>
                    <select value={this.state.selectedShipper} onChange={this.handleSelectShipper} required>
                        {this.renderShippers()}
                    </select>
              <input type="submit" value='Slutföra Ditt Köp'/>
          </form>
          <Link to={"/shoppingCard"}>
                    <span onClick={()=>{ changeUrl('shoppingCard')}}>Want To Go Back ToShopping Cart</span>
        </Link>
        </FormMall>

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
  