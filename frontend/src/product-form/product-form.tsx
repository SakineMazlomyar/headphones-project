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
interface Modified {
    _id:string,
    productName: string,
    unitInStock:number,
    unitPrice:number,
    pictureUrl:string,
    description:string
  
}
interface Props {
  modified:Modified
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
        let requestBody = {
            query: `mutation {
                 createProduct(ProductInput: {
                     productName: "${this.state.productName}",
                  unitPrice: ${Number(this.state.unitPrice)},
                   pictureUrl: "${this.state.pictureUrl}", 
                   unitInStock: ${Number(this.state.unitInStock)},
                    description:"${this.state.description}" }) {
                   _id
                   
                 }
               }
               
             `
           };
        if(this.props.modified._id !== '') {
     
        requestBody = {
           query: `mutation {
            updateChoosenProduct(ProductUpdate: {
                _id:"${this.props.modified._id}",
                productName: "${this.state.productName}",
                 unitPrice: ${Number(this.state.unitPrice)},
                  pictureUrl: "${this.state.pictureUrl}", 
                  unitInStock: ${Number(this.state.unitInStock)},
                   description:"${this.state.description}" }) {
                  _id
                  
                }
              }
              
            `
          };
       
        }
          let data = await  requestHandler(requestBody);
          if(typeof data !== 'undefined') {
                console.log(data)
              data.createProduct?alert("Success to create a produkt id= " +  data.createProduct._id):alert("Updated succes")
          }
        
    }

    handleProduktName = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({productName:event.target.value }  )};
    handleProduktDescription= (event: React.ChangeEvent<HTMLTextAreaElement>)=>{this.setState({description:event.target.value } )}
    handleProduktPictureurl= (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({pictureUrl:event.target.value } )}
    handleUnitInStock = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({unitInStock:event.target.value } )}
    handleProductPrice = (event: React.ChangeEvent<HTMLInputElement>)=>{this.setState({unitPrice:event.target.value } )}
    displayChoosenDataToModifiy = ()=>{
        if(this.props.modified._id !== '') {
            return <ul className={"orderContainer"}>
                <li>id: {this.props.modified._id}</li>
                <li>url: {this.props.modified.pictureUrl}</li>
                <li>namn: {this.props.modified.productName}</li>
                <li>beskrivning: {this.props.modified.description}</li>
                <li>pris: {this.props.modified.unitPrice}</li>
                <li>unitInStock: {this.props.modified.unitInStock}</li>

            </ul>
        }
    }
    render () {
        return( 

            <FormMall>
                 <form onSubmit={this.handleSubmit} className={"formStyle"}>
                    {this.displayChoosenDataToModifiy()}
                    <input className={"inputStyle"} type="text"  placeholder='product-name' onChange={this.handleProduktName} value={this.state.productName}  required/>
                    <input type="number" name="quantity" min="1" max="1000" placeholder='unitInStock' onChange={this.handleUnitInStock} value={ this.state.unitInStock}/>
                    <input className={"inputStyle"} type="text"  placeholder="unitPrice" onChange={this.handleProductPrice} value={this.state.unitPrice} required/>
                    <input className={"inputStyle"} type="text"  placeholder="pictureUrl.jpg" onChange={this.handleProduktPictureurl} value={this.state.pictureUrl} required/>
                    <textarea placeholder="descrption"  value={this.state.description} onChange={this.handleProduktDescription}/>
                       
                    <input type="submit" value='Submit'/>
                </form>
            </FormMall>)
    }
}
