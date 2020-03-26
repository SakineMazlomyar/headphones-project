import React from 'react';
import  './productPage.css';
import { requestHandler} from '../helpers/requestHandler';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
interface Props {
  getAddedProducts:(data:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>void,
 
}

interface Product {
    productName: string,
    _id:string,
    unitPrice:number,
    unitInStock:number,
    pictureUrl:string,
    description:string
}
interface State {
    products:Product[],
    viewProduct:boolean,
    choosenProduct:Product,
    visible:boolean
}
export default class ProductPage extends React.Component<Props, State> {
  //private pictures: string[]
  private timerID:any
    constructor(props:Props){
        super(props);
            this.state ={ 
            products:[{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:"", description:""}],
            viewProduct:false,
            choosenProduct:{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:"", description:""},
            visible:false
          
        
        }

   
    }


    componentDidMount() { this.getProducts() }
    getProducts = async () => {
      //actuResponse.data.products
        let requestBody = {
              query: `
              { products {
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
   
    renderProducts= ()=> {
        if(this.state.products.length > 0 && this.state.viewProduct === false) {
           let products =  this.state.products.map((product:{ productName: string, _id:string, unitPrice:number,unitInStock:number, pictureUrl:string, description:string})=>{
            
            if(product._id !== '') {
              
             return   <div  className={"backgroundOdd d-flex flex-column align-items-center"}>
                <img className={'img'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
               
                <h6>{product.productName}</h6>
                <h6>{product.unitPrice+" SEK"}</h6>
                <h6>Produkt quentity: {product.unitInStock}</h6>
                <Link to={`/singleProduct/id=${product._id}`}> 
                 <button id="viewButton" onClick={()=> this.viewProduct(product)}>View Product!</button>
                </Link> 
              </div>
            }
                    
            })


            return <div className={"container-fluid d-flex flex-column  "}> 
                      {products}
                  </div>
        }
    }

    showAddedProduct = ()=> { 

      this.setState({visible:true},()=>{
        window.setTimeout(()=>{
          this.setState({visible:false})
        },1000)
      });


    
    }


    addProduct = (product:{ productName: string, _id:string, unitPrice:number,unitInStock:number,pictureUrl:string})=>{
        
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
        parsedShoppingCart.push(product);
        
        localStorage.setItem("shoppingcart", JSON.stringify(parsedShoppingCart));
        this.props.getAddedProducts(parsedShoppingCart);
       this.showAddedProduct();
      

    }
    viewProduct = (product:{ productName: string, _id:string, unitPrice:number,unitInStock:number, pictureUrl:string, description:string})=>{
      this.setState({ viewProduct:true, choosenProduct: product})
     
    }


/*   
    in case if singleProductPage wont work
      viewOnProduct = ()=>{
      if(this.state.viewProduct) {
        return <div>
        <h5 id="link" onClick={()=> this.setState({viewProduct:false}) }>Go Back!</h5>
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
    } */





    render(){
        return(
          <div id="allContainer">
            {this.renderProducts()}
            {/* this.viewOnProduct() */}
          </div>
            
        )
    }
}






