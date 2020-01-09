import FormMall from '../signInSignUp/FormMall';
import React  from 'react';
import { requestHandler } from '../helpers/requestHandler';


interface State {
    companyName:string,
    shippingPrice:string,
    shippingMethod:string
  
}

interface Modified {
    _id:string,
    companyName:string,
    shippingPrice:Number,
    shippingMethod:string
  
}
interface Props {
    modified: Modified,
    getAllShipperMethods:()=>any
}
export default class ShipperForm extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            companyName:'',
            shippingPrice:'',
            shippingMethod:''
        }
    }
    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        let requestBody = {
            query: `
            mutation {
                createShipper(ShipperInput: {companyName:"${this.state.companyName}",
                 shippingPrice:${Number(this.state.shippingPrice)},
                  shippingMethod:"${this.state.shippingMethod}"
                }) {
                  _id
                }
              }`
           };
       
           if(this.props.modified._id !== '') {
            requestBody = {
                query: `
                mutation {
                    updateChoosenShipper(ShipperUpdate: {_id: "${this.props.modified._id}",
                      companyName: "${this.state.companyName}",
                       shippingPrice:${Number(this.state.shippingPrice)}, shippingMethod: "${this.state.shippingMethod}"}) {
                      _id
                    }
                  }
                `
            }
          
           }
    
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {

              data.createShipper? this.setState({companyName:'', shippingMethod:'', shippingPrice:''},async ()=>
                alert("Success to create a shipper method "+data.createShipper._id)
               ):alert("Succes to update");
          }
    }

    handleCompnayName = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({companyName:event.target.value }  )};
    handleShippingPrice= (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({shippingPrice:event.target.value } )}
    handleShippingMethod= (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({shippingMethod:event.target.value } )}
    displayChoosenDataToModifiy = ()=>{
        if(this.props.modified._id !== '') {
            return <ul className={"orderContainer"}>
                <li>id: {this.props.modified._id}</li>
                <li>namn: {this.props.modified.companyName}</li>
                <li>Method: {this.props.modified.shippingMethod}</li>
                <li>pris: {this.props.modified.shippingPrice}</li>
            </ul>
        }
    }

    render () {
        return( 

            <FormMall>
                 <form onSubmit={this.handleSubmit} className={"formStyle"}>
                    {this.displayChoosenDataToModifiy()}
                    <input className={"inputStyle"} type="text"  placeholder='company-name' onChange={this.handleCompnayName} value={this.state.companyName}  required/>
                    <input className={"inputStyle"} type="text"  placeholder="shipping-price" onChange={this.handleShippingPrice} value={this.state.shippingPrice} required/>
                    <input className={"inputStyle"} type="text"  placeholder="shipping-method" onChange={this.handleShippingMethod} value={this.state.shippingMethod} required/>
                    <input type="submit" value='Submit'/>
                </form>
            </FormMall>)
    }
}
