const express = require('express');
require('./backend/connection').initilise();
const bodyParser = require('body-parser');
const path = require('path');
const graphqlHTTP = require('express-graphql');
let paypal = require('paypal-rest-sdk');
let app = express();
require('./backend/secret').configPaypal(paypal);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Product = require('./backend/models/product');
const Shipper = require('./backend/models/shipper');
const Order = require('./backend/models/order');
const User = require('./backend/models/user');
const OrderDetails = require('./backend/models/orderDetails');
const Root  = require('./backend/resolvers/resolver');
const Schema = require('./backend/schemas/schema');









/* 
//Here is how to use the build react
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('/', function(req, res) {
res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'));
}); */


app.use('/graphql',graphqlHTTP({
    schema:Schema ,
    graphiql:true,
    rootValue: Root,
}));


/* 
To do this day:
fix cancel and success url
fix how to show data for user after they save their order send 
 */


let currentData;
app.post('/pay2', (req, res, next) => {
    currentData = req.body;
 
    var create_payment_json = {
        "intent": "sale",
        "payer": { 
            "payment_method": "paypal"
        },
        "redirect_urls": { 
            "return_url": "http://"+req.hostname+":5000/success",
            "cancel_url": "http://"+req.hostname+":5000/canceled"
        },
        "transactions": [{
            "item_list": {
                "items": req.body.items
            },
            "amount": {
                "currency": "SEK",
                "total": currentData.totalPrice.toString()+'.'+'00'
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          
            console.log(error)

            throw error;
        } else {
            
            let links = payment.links;
            for(let i = 0; i<links.length; i++) {
                if(links[i].rel === 'approval_url'){
                    
                   res.json({url: links[i].href})
                
                }
            }
          
        }
    });
  
})


app.get('/success',(req,res)=> {
 
    let paymentId= req.query.paymentId;
    let payerId = req.query.PayerID;
 
    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "SEK",
                "total": currentData.totalPrice.toString()+'.'+'00'
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment)=> {
        if (error) {
         
            throw error;
        } else {
            try {
                let user = await User.findById(currentData.createdOrder);
                let relUser = await user
              
                if(!relUser ) {
                    throw new Error('This user does not exist!')
                    
                } else {
    
                    try {
                        const order= new Order ({
                            shipFirstName:currentData.shipFirstName,
                            shipLastName:currentData.shipLastName,
                            shippAdress:currentData.shippAdress,
                            shippPostelCode:currentData.shippPostelCode,
                            shipCity:currentData.shipCity,
                            shipMail:currentData.email,
                            shipPhoneNo:currentData.tel,
                            totalPrice:currentData.totalPrice,
                            orderDate:currentData.orderDate,
                            createdOrder:currentData.createdOrder,
                            selectedShipper:currentData.selectedShipper
                           
                           
                        })
                        relUser.orders.push(order);
                        let savedOrder = order.save();
                        user.save();
                        let createdCurrentOrder = await savedOrder;
                        let tr = await createdCurrentOrder;
                      
                         if(tr !== null || tr !== undefined) {
                                                                
                            let orderDetails = new OrderDetails({
                                quentity: 1,
                                orderId: tr._id, 
                                productIds : currentData.productIds
                            })
                            let th = orderDetails.save();
                            let createdOrderDe = await th
                            let relCreatedOrderDe = await createdOrderDe;
                        
                            let count = {};
                            relCreatedOrderDe.productIds.forEach(function(i) { 
                            count[i] = (count[i]||0) + 1});
                                
                            let product = await (await Product.find({ "_id": { "$in":relCreatedOrderDe.productIds }})).filter(async (pr) =>{
                                
                                for(rt in count ) {
                                  
                                    if(`"${pr._id}"` === `"${rt}"`) {
                                        pr.unitInStock = pr.unitInStock-count[rt] 
                                       let tr =  await Product.updateOne({"_id":pr._id}, { "$inc": { unitInStock:-count[rt]} });
                                       let h  = await tr
                                     
                                    }
                                }

                            });
                            /* Change it when you deploy the app */
                            res.send('Success To Create Your Order.Close This page Or Conctinue Shopping !')
                            
                         }

                    } catch(error) {
                        throw new Error (error)
                    }
                
                }
            } catch(error){
                throw  new Error("Error at creating new order by choosen user" + error)
            }

        }
    });
})

app.get('/canceled',(req,res)=>{
    res.send('Canceled')
})




const port = 5000;
let portInfo = app.listen(port,()=>{ console.log('Server started at port: '+ portInfo.address().port)});
