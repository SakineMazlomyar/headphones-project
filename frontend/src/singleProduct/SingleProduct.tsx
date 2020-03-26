import React from 'react';

import { getValueFromLocalstoreage, requestHandler,  removeValueFromLocalstoreage,setValueToLocalstoreage } from '../helpers/requestHandler';
import { Alert} from 'reactstrap';
import { Link } from 'react-router-dom';
interface Props{
    getAddedProducts:(data:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>void
}
interface Product {
  productName: string,
  _id:string,
  unitPrice:number,
  unitInStock:number,
  pictureUrl:string,
  description:string
}

interface State{
    visible:boolean,
    choosenProduct:Product
}
export default class SingleProduct extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
            this.state ={ 
                visible:false,
                choosenProduct:{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:"", description:""}
        }
    }
    componentDidMount(){

      this.findSpeceficProduct()
    }

    findSpeceficProduct = async ()=>{
      let url_string = window.location.href
      let url = new URL(url_string);
      let param = url.pathname.substring(18)
         let requestBody = {
          query: `{
            getSpeceficProduct(_id: "${param}") {
              _id,
              productName,
              unitPrice
              pictureUrl,
              unitInStock,
              description
            }
          }`
        };
      
      let data = await  requestHandler(requestBody);

      typeof data !== 'undefined' ? this.setState({choosenProduct:data.getSpeceficProduct}): this.setState({choosenProduct:{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:"", description:""}})

    }








    showAddedProduct = ()=> { 

        this.setState({visible:true},()=>{
          window.setTimeout(()=>{
            this.setState({visible:false})
          },1000)
        });
  
  
      
      }
    
    addProduct = (product:{ productName: string, _id:string, unitPrice:number,unitInStock:number,pictureUrl:string})=>{

        let shoppingCart:any = getValueFromLocalstoreage("shoppingcart");
        
        shoppingCart.push(product);
        setValueToLocalstoreage("shoppingcart", shoppingCart);

        this.props.getAddedProducts(shoppingCart);
        this.showAddedProduct();
    }

    removeSelectedProduct = () => { removeValueFromLocalstoreage('selectedProducts');}

    renderSelectedProdcut = () => {
       
        if(this.state.choosenProduct._id !== "") {
         
          return <div>
        <Link to={`/productPage`}> 
        <i className="fas fa-arrow-left left-arrow-color" id="link"></i>
         
        </Link> 
          <Alert color="alert alert-success" isOpen={this.state.visible} >
                 You Added One Product To Shopping Cart
          </Alert>
          <div  className={"backgroundOdd d-flex flex-column align-items-center"}>
            <img className={'img'} src={process.env.PUBLIC_URL +`/imgs/${this.state.choosenProduct.pictureUrl}`} alt={this.state.choosenProduct.productName}/>
            <div className={"detailContainer"}>
            <h6>Name: {this.state.choosenProduct.productName}</h6>
            <h6> Price: {this.state.choosenProduct.unitPrice+" SEK"}</h6>
            <h6>Produkt Quantity: {this.state.choosenProduct.unitInStock}</h6>
            <div>Description: {this.state.choosenProduct.description}</div>
           
            <button id="addButton"onClick={()=> this.addProduct(this.state.choosenProduct)}>Add To Shopping Cart!</button>
  
            </div>
          </div>
        </div>
  
  
        } 
      }
      


    render(){
        return(
            <div>
              { this.renderSelectedProdcut()}
            </div>
            
      
        )
    }
}





