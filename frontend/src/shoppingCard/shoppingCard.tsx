import React from 'react';
import { Link } from 'react-router-dom';
import  './shoppingCard.css';
import { changeUrl } from '../helpers/requestHandler';
import { Alert } from 'reactstrap';
interface Props {
    amount:number,
    getAddedProducts:(data:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>void,

}

interface State {
  
    removed:boolean,
    visible:boolean
}
export default class ShoppingCard extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
        this.state = {
            removed:false,
            visible:false
        }
    }

    showMessageForRemovedProduct = ()=> { 

        this.setState({visible:true},()=>{
          window.setTimeout(()=>{
            this.setState({visible:false})
          },1000)
        });
    }
  

    removeItem = (product:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string }, i:number)=>{
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
        parsedShoppingCart.some((value:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string }, index:number)=>{
            if(value._id === product._id && index === i) {
                parsedShoppingCart.splice(index, 1)
            }
        
        })
       
        localStorage.setItem("shoppingcart", JSON.stringify(parsedShoppingCart ))
        this.setState({removed: true});
        this.props.getAddedProducts(parsedShoppingCart);
        this.showMessageForRemovedProduct()
    }

    getProductsFromShopingCard = ()=> {
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
       
        if(parsedShoppingCart !== null && parsedShoppingCart.length > 0 ||this.state.removed === true){
           
            return parsedShoppingCart.map((product:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string }, index:number)=>{
                return <div className={"d-flex flex-column align-items-center backgroundOdd container"}>
                             <img id={'img'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                             <h4>{product.productName}</h4>
                             <h4>{product.unitPrice+' SEK'}</h4>
                             <span>Quantity: {1}</span>
                             <button id="removeButton"onClick={()=> this.removeItem(product, index)}>Remove</button>
                            
                           </div>
            })


        }
    }

    renderLinkToCheckOut = ()=>{
        if(this.props.amount >= 0) {
            return (
                <Link to={"/checkOut"}>
                    <span id={"vidareKassan"} className={"containerVidareKassan"} onClick={()=>{ changeUrl('checkOut')}}>Go To Checkout!</span>
                </Link>
            )
        } else {
            return ''
        }
    }

  

    render(){
        return(
                
            <div>
                <h4 id={'shopping-cart-title'}>Welcome To Shopping Cart</h4>
                {this.renderLinkToCheckOut()}
                <Alert color="alert alert-danger" isOpen={this.state.visible} >
                You Removed One Product
                </Alert>
            <div  className={"d-flex align-items-center backgroundOdd majorContainer"} >
                {this.getProductsFromShopingCard()}
            </div>
            </div>
            
        )
    }
}




