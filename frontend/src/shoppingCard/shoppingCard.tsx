import React from 'react';
import { Link } from 'react-router-dom';
import  './shoppingCard.css';
import { changeUrl } from '../helpers/requestHandler';
interface Props {
    amount:number,
    getAddedProducts:(data:[{productName: string,_id:string, unitPrice:number, unitInStock:number,pictureUrl:string}])=>void,

}

interface State {
  
    removed:boolean,
    test:any
}
export default class ShoppingCard extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
        this.state = {
        
            removed:false,
            test:[]
        }
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
        alert('You Remove One item!');
    }

    getProductsFromShopingCard = ()=> {
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
       
        if(parsedShoppingCart !== null && parsedShoppingCart.length > 0 ||this.state.removed === true){
           
            return parsedShoppingCart.map((product:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string }, index:number)=>{
                return <div 
                className={"d-flex flex-column align-items-center backgroundOdd container"}
               
                >
                             <img id={'img'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                             <h4>{product.productName}</h4>
                             <h4>{product.unitPrice+' SEK'}</h4>
                             <span>Antal: {1}</span>
                             <button id="removeButton"onClick={()=> this.removeItem(product, index)}>Remove</button>
                            
                           </div>
            })


        }
    }

    renderLinkToCheckOut = ()=>{
        if(this.props.amount >= 0) {
            return (
                <Link to={"/checkOut"}>
                    <span id={"vidareKassan"} onClick={()=>{ changeUrl('checkOut')}}>Go To Checkout!</span>
                </Link>
            )
        } else {
            return ''
        }
    }

  

    render(){
        return(
                
            <div>
                {this.renderLinkToCheckOut()}
                <h1>Here is shopping card</h1>
            <div  className={"container-fluid d-flex flex-row align-items-center backgroundOdd majorContainer"} >
                {this.getProductsFromShopingCard()}
            </div>
            </div>
            
        )
    }
}




