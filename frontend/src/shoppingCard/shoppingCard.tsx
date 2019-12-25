import React from 'react';
import CheckOut from '../checkOut/checkOut';
import Form from '../signInSignUp/Form';

interface P {
    userInfo: {username:string, id:string}
}
interface State {
  
    removed:boolean
}
export default class ShoppingCard extends React.Component<P, State>{
    constructor(props:P){
        super(props);
        this.state = {
        
            removed:false
        }
    }



    removeItem = (product:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string })=>{
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
        parsedShoppingCart.some((value:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string }, index:number)=>{
            if(value._id === product._id ) {
                parsedShoppingCart.splice(index, 1)
            }
        
        })
       
        localStorage.setItem("shoppingcart", JSON.stringify(parsedShoppingCart ))
        this.setState({removed: true})
        alert('Du tog bort en item!')
    }

    getProductsFromShopingCard = ()=> {
        let shoppingCart:any = localStorage.getItem("shoppingcart");
        let parsedShoppingCart = JSON.parse(shoppingCart);
        if(parsedShoppingCart.length > 0 ||this.state.removed === true){
            return parsedShoppingCart.map((product:{productName: string, _id:string, unitPrice:number, unitInStock:number, pictureUrl:string })=>{
                return <div 
                className={"d-flex flex-column align-items-center backgroundOdd"}
               
                >
                             <img className={'img'} src={process.env.PUBLIC_URL +`/imgs/${product.pictureUrl}`} alt={product.productName}/>
                             <h2> Produkt Namn: {product.productName}</h2>
                             <h3>Produkt priset: {product.unitPrice}</h3>
                             <h4>Produkt quentity: {product.unitInStock}</h4>
                             <button onClick={()=> this.removeItem(product)}>Remove</button>
                            
                           </div>
            })


        }
    }

    /* check how to redirect user here  */
    goTOCheckOut = ()=>{
        if(this.props.userInfo.username !== '') {
            console.log(window.location.href)
             
         
        } else {
            
           
        }
    }


    render(){
        return(
                
            <div>
                <button onClick={this.goTOCheckOut}>Gå vidare till kassan</button>

            <div  className={"container-fluid"}>
                <h1>Here is shopping card</h1>
                {this.getProductsFromShopingCard()}
            </div>
            </div>
            
        )
    }
}




