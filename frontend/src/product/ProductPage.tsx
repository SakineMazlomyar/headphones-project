import React from 'react';
import Axios from 'axios';
import  './productPage.css'

interface Props {
  getAddedProducts:(data:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>void
}

interface Product {
    productName: string,
    _id:string,
    unitPrice:number,
    unitInStock:number,
    pictureUrl:string
}
interface State {
    products:Product[]
}
export default class ProductPage extends React.Component<Props, State> {
  //private pictures: string[]

    constructor(props:Props){
        super(props);
            this.state ={ 
            products:[{productName: "", _id: "", unitPrice:0, unitInStock:0, pictureUrl:""}]
          
        
        }

   
    }


    componentDidMount(){
    
        this.getProducts()

    }
    getProducts = async () => {
        let requestBody = {
              query: `
              {
                products {
                  productName
                  _id
                  unitPrice
                  unitInStock
                  pictureUrl 
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
            
            
            res.status !== 200 ? this.setState({products:[]}): this.setState({products:actuResponse.data.products},()=>{console.log(this.state.products)});

          } catch(err){
            //alert('Could not get all Products!')
             console.log(err)
          }

    }
   
    renderProducts= ()=> {
        if(this.state.products.length > 1) {
           return  this.state.products.map((product:{ productName: string, _id:string, unitPrice:number,unitInStock:number, pictureUrl:string})=>{
            
            
                    
             return   <div 
             className={"d-flex flex-column align-items-center backgroundOdd"}
            
             >
                          <img className={'img'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                          <h2> Produkt Namn: {product.productName}</h2>
                          <h3>Produkt priset: {product.unitPrice}</h3>
                          <h4>Produkt quentity: {product.unitInStock}</h4>
                          <button onClick={()=> this.addProduct(product)}>Lägg i Varukorg!</button>
                          <button onClick={()=> this.viewProduct(product)}>View Product!</button>
                        </div>
            })
        }
    }

    addProduct = (product:{ productName: string, _id:string, unitPrice:number,unitInStock:number,pictureUrl:string})=>{
        
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
        parsedShoppingCart.push(product);
        localStorage.setItem("shoppingcart", JSON.stringify(parsedShoppingCart));
        this.props.getAddedProducts(parsedShoppingCart);
        alert('Du laggt till en produkt!')

    }
    viewProduct = (product:{ productName: string, _id:string, unitPrice:number,unitInStock:number})=>{
        console.log(product)
    }





    render(){
        return(
          <div className={"container-fluid"}> 
               {this.renderProducts()}
            </div>
            
        )
    }
}





