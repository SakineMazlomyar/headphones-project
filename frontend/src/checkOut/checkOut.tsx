import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';
import FormMall from '../signInSignUp/FormMall';
import { Link } from 'react-router-dom';
interface Props {

totalPrice:number
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
                selectedShipper:'5e03818e0ba8e433a8a60c55',
                shippers:[]
        
        }
    }

    componentDidMount() {
        this.getShipperMethods();
        let createdOrder = new Date().toISOString();
        this.handleOrderDate(createdOrder);
        this.handleOrderPrice();
        this.handleCreatedOrder()
        
    }

    getShipperMethods =async ()=> {
        let requestBody = {query:`
            { shippers {
            _id
            shippingMethod
            shippingPrice,
            companyName
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
          console.log(actuResponse)
          actuResponse.data.shippers !== false ? this.setState({shippers: actuResponse.data.shippers},()=>{console.log(this.state.shippers, 'here is test')}): this.setState({shippers:[]})
          
        

        } catch(err){
          //alert('Could not get all Products!')
           console.log("Error at getting shippers"+err)
        }
    }

    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      /* Check if createdOrder == '' then can not slutför ditt köpet else förtsätt */
        console.log(this.state)
     
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

        console.log(initTolatlPrice)
        let finalTotalPrice = totalPrice === 0?  initTolatlPrice: totalPrice
        this.setState({totalPrice: finalTotalPrice}
        
    ) }

    //Fix these inputs dynamic
    handleCreatedOrder = ()=>{ 
        let current_user :any = localStorage.getItem("current_user");
        let parsedCurrentUser:any = JSON.parse(current_user);
        if(current_user) {
            this.setState({createdOrder:parsedCurrentUser.id})
        }

    }
    handleSelectShipper = (event: any)=>{ this.setState({selectedShipper:event.target.value}) }

    
    renderShippers = ()=>{
        if(this.state.shippers.length > 0) {

            return this.state.shippers.map((shipper:{_id:string ,companyName:string ,shippingPrice:number,shippingMethod:string})=>{

            return <option value={shipper._id}>{shipper.companyName}</option>
            })
           
        }
    }
   
    render(){
        return (
            <FormMall>
                <h1>Here is kassan </h1>
                <Link to={"/shoppingCard"}>
                    <h5>Gå Tillbaka Tillbaka</h5>
                </Link>
                <form onSubmit={this.handleSubmit} style={formtStyle}>
                    <label><i className="fa fa-user"></i> Userrname</label>
                    <input type="text" id="fname" name="firstname" placeholder="Sven" onChange={this.handleFirstName} />

                    <label ><i className="fa fa-user"></i> Lastname</label>
                    <input type="text" id="lname" name="lastname" placeholder="Svensson" onChange={this.handleLastName}/>

                    <label><i className="fa fa-envelope"></i> Email</label>
                    
                    <input type="email" id="email" name="email" placeholder="john@example.com" onChange={this.handleEmailAndPhone }/>
                    <label><i className="fa fa-home"></i> Address</label>
                    <input type="text" id="adr" name="address" placeholder="Svenssongatan 14a" onChange={this.handleAddresss} />

                    <label> City</label>
                    <input type="text" id="city" name="city" placeholder="Goteborg" onChange={this.handleShipperCity}/>

                    <label><i className="fa fa-institution"></i> Postal code</label>
                    <input type="text" id="postalcode" name="postalcode" placeholder="43350" onChange={this.handleShipperPostalconde} />

                    <label> Phone</label>
                    <input type="tel" id="shipPhoneNO" name="shipPhoneNO" placeholder="1212" onChange={this.handleEmailAndPhone }/>

                    <label> Total Price In Sek</label>
                    <h5>{this.state.totalPrice} kr</h5>
                    <select value={this.state.selectedShipper} onChange={this.handleSelectShipper}>
                        {this.renderShippers()}
                    </select>
              <input type="submit" value='Slutföra Ditt Köp'/>
          </form>
        </FormMall>

        )
    }
}


const input: CSSProperties={
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
  