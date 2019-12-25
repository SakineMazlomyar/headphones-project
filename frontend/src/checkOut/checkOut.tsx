import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';
import FormMall from '../signInSignUp/FormMall';

interface Props {


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
    shipMail:String,
    shipPhoneNo:String,
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
                shipMail:'',
                shipPhoneNo:'',
                totalPrice:0,
                orderDate:'',
                createdOrder:'',
                selectedShipper:'',
                shippers:[]
        
        }
    }

    componentDidMount() {
        this.getShipperMethods()
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
        event.preventDefault()
     
    }



    handleFirstName = (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipFirstName:event.target.value }) }
    handleLastName= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipLastName:event.target.value }) }
    handleAddresss= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shippAdress:event.target.value }) }
    handleShipperPostalconde= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shippPostelCode:event.target.value }) }
    handleShipperCity= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipCity:event.target.value }) }
    handleEmail= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipMail:event.target.value }) }
    handlePhone= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({shipPhoneNo:event.target.value }) }
    handleOrderPrice= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({totalPrice:event.target.value }) }
    handleOrderDate= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({orderDate:new Date().toISOString() }) }
    handleCreatedOrder= (event: React.ChangeEvent<HTMLInputElement>)=>{ this.setState({createdOrder:''}) }
    
    


    renderShippers = ()=>{
        if(this.state.shippers.length > 0) {

            return this.state.shippers.map((shipper:{_id:string ,companyName:string ,shippingPrice:number,shippingMethod:string})=>{

            return <option value={shipper._id}>{shipper.companyName}</option>
            })
           
        }
    }

    handleSelect = (event: any)=>{
        console.log(event.target.value, 'choosen shipping method')
        this.setState({selectedShipper:event.target.value})
    }

   
    render(){
        return (
            <FormMall>
                <h1>Here is kassan </h1>
                <form onSubmit={this.handleSubmit} style={formtStyle}>
                    <label><i className="fa fa-user"></i> Userrname</label>
                    <input type="text" id="fname" name="firstname" placeholder="Sven" />

                    <label ><i className="fa fa-user"></i> Lastname</label>
                    <input type="text" id="lname" name="lastname" placeholder="Svensson" />

                    <label><i className="fa fa-envelope"></i> Email</label>
                    
                    <input type="email" id="email" name="email" placeholder="john@example.com" />
                    <label><i className="fa fa-home"></i> Address</label>
                    <input type="text" id="adr" name="address" placeholder="Svenssongatan 14a" />

                    <label> City</label>
                    <input type="text" id="city" name="city" placeholder="Goteborg" />

                    <label><i className="fa fa-institution"></i> Postal code</label>
                    <input type="text" id="postalcode" name="postalcode" placeholder="43350" />

                    <label> Phone</label>
                    <input type="text" id="shipPhoneNO" name="shipPhoneNO" placeholder="1212" />

                    <label> Total Price In Sek</label>
                    <input type="text" id="totalPrice" name="totalPrice" placeholder="0" />
                    <select value={this.state.selectedShipper} onChange={this.handleSelect}>
                        {this.renderShippers()}
                    </select>
              <input type="submit" value='Submit'/>
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
  