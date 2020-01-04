import FormMall from '../signInSignUp/FormMall';
import React  from 'react';
import { requestHandler } from '../helpers/requestHandler';


interface State {
    productName: string,
    unitInStock:string,
    unitPrice:string,
    pictureUrl:string,
    description:string
  
}
interface Props {
  
}
export default class ProductForm extends React.Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            productName: '',
            unitInStock:'',
            unitPrice:'',
            pictureUrl:'',
            description:''
        }
    }
    handleSubmit= async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(this.state)
        //"As consumer demand for live streaming and mobile video increases, Qorvo's core RF solutions equip mobile devices with the capability to meet the growing need for data."
        let requestBody = {
           query: `mutation {
                createProduct(ProductInput: {productName: "${this.state.productName}",
                 unitPrice: ${Number(this.state.unitPrice)},
                  pictureUrl: "${this.state.pictureUrl}", 
                  unitInStock: ${Number(this.state.unitInStock)},
                   description:"${this.state.description}" }) {
                  _id
                  
                }
              }
              
            `
          };
       
    
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {

              data.createProduct?alert("Success to create a produkt id= " +  data.createProduct._id):alert("Failed to create produkt!")
          }
    }

    handleProduktName = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({productName:event.target.value }  )};
    handleProduktDescription= (event: React.ChangeEvent<HTMLTextAreaElement>)=>{this.setState({description:event.target.value } )}
    handleProduktPictureurl= (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({pictureUrl:event.target.value } )}
    handleUnitInStock = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({unitInStock:event.target.value } )}
    handleProductPrice = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({unitPrice:event.target.value } )}

    render () {
        return( 

            <FormMall>
                 <form onSubmit={this.handleSubmit} className={"formStyle"}>
           
                    <input className={"inputStyle"} type="text"  placeholder='product-name' onChange={this.handleProduktName} value={this.state.productName}  required/>
                    <input type="number" name="quantity" min="1" max="1000" placeholder='unitInStock' onChange={this.handleUnitInStock}/>
                    <input className={"inputStyle"} type="text"  placeholder="unitPrice" onChange={this.handleProductPrice} value={this.state.unitPrice} required/>
                    <input className={"inputStyle"} type="text"  placeholder="pictureUrl.jpg" onChange={this.handleProduktPictureurl} value={this.state.pictureUrl} required/>
                    <textarea placeholder="descrption"  value={this.state.description} onChange={this.handleProduktDescription}/>
                       
                    <input type="submit" value='Submit'/>
                </form>
            </FormMall>)
    }
}
