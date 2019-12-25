import React from 'react';

import { RouteComponentProps } from 'react-router-dom';
interface Props extends RouteComponentProps {}

interface State {
  
    removed:boolean
}
export default class ShoppingCard extends React.Component<Props, State>{
    constructor(props:Props){
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
        if(parsedShoppingCart !== null && parsedShoppingCart.length > 0 ||this.state.removed === true){
           
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
       let current_user: any = localStorage.getItem('current_user');
       let parsedCurrentUser = JSON.parse(current_user)
      
       if(current_user === null) {
         
           this.props.history.push('SigninSignUp')
        } else {
            this.props.history.push('checkOut')
         
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




