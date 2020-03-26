const User = require('../models/user');
const Product = require('../models/product');
const Shipper = require('../models/shipper');
const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const bcrypt = require('bcryptjs');
const Subscription = require('../models/subscription');


const  Root ={
    
    users :()=>{
        try {

            return User.find();
        }catch(error) {
            throw new Error('Error at finding all users '+ error)
        }
    },
    createUser: (args) => {
        return User.findOne({email:args.UserInput.email}).then((user)=>{
            if(user) {
                throw new Error('User already exist!')
            }
            
        
            return bcrypt.hash(args.UserInput.password, 12)
            
        }).then((password)=>{
           
            const user = new User({
                email:args.UserInput.email,
                password:password,
                username:args.UserInput.username
            })
            return user.save()
    
        }).then((result)=>{
            
                return {...result._doc, _id:result.id}
        }).catch((error)=>{
                console.log('Error at Create user '+ error)
                throw error
        })


    },
    login: async ({ email, password }) => {
    try {

        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          
          throw new Error('Password is incorrect!');
        }
        
        return{userId:user._id, email:user.email, username:user.username};
    }catch(error){
        console.log('Error at sign in '+ error)
    }
  },

    products :()=>{
        try {
            
            
            return Product.find();
        } catch(error) {
            throw new Error('Error at finding all product '+ error)
        }
    },
    getSpeceficProduct: async ({_id}) => {
        try {
           
            let product = await Product.findById(_id);
            let relProduct = await product;
            if(!relProduct ) {
                throw new Error('We could not find the specefic product')
                
            } else {
    
            return relProduct
            }
        } catch(error){
            throw  new Error("Error at finding specefic product" + error)
        }

    },
    createProduct: async (args) => {
        
        try {

            let productRes = await Product.findOne({productName:args.ProductInput.productName});
            let relProduct = await productRes
            if(relProduct) {
                throw new Error('Product alread exist')
                
            } else {

                const product = new Product ({
                    productName:args.ProductInput.productName,
                    unitInStock:args.ProductInput.unitInStock,
                    unitPrice:args.ProductInput.unitPrice,
                    pictureUrl:args.ProductInput.pictureUrl,
                    description:args.ProductInput. description
                })
    
                return product.save();
            }
        } catch(error){
            throw error
        }
    },
    deleteProduct: async (args) => {
        try {
            
            let deletedPro = await Product.deleteOne({_id:args.ProductDelete._id});
            return deletedPro
        } catch (error){
            throw new Error ('Error at delete product' + error)
        }
    },
    shippers :()=>{
        try {

            return Shipper.find();
        } catch(error) {  
            throw new Error ('Error finding shippers' + error)
        }
    },
    createShipper: async (args) => {
        try {

            let ShipperRes = await Shipper.findOne({companyName:args.ShipperInput.companyName});
            let relShippers = await ShipperRes 
            
            if(relShippers) {
                throw new Error('Shipper Method Already exsit')
                
            } else {

                const shipper= new Shipper ({
                    companyName:args.ShipperInput.companyName,
                    shippingPrice:args.ShipperInput.shippingPrice,
                    shippingMethod:args.ShipperInput.shippingMethod,
                   
                })
    
                return shipper.save();
            }
        } catch(error){
            throw  new Error("Error at creating new shipper " + error)
        }
    },

    updateChoosenShipper: async(shipper)=>{
        try {
           
            let choosenShippetToUpdate =  await Shipper.updateOne(
            {"_id":shipper.ShipperUpdate._id},
            { companyName:shipper.ShipperUpdate.companyName,
                shippingMethod:shipper.ShipperUpdate.shippingMethod,
                shippingPrice:shipper.ShipperUpdate.shippingPrice,
               
            });
            let updatedShipper = await choosenShippetToUpdate;
            
            let ship = await Shipper.findById(shipper.ShipperUpdate._id);
            let relShip = await ship;
          
         
            if(!ship ) {
                throw new Error('We chould not find this shipper')
                
            } else {
        
            return relShip
            }
        } catch(error){
            throw  new Error("Error at updating specefic shipper" + error)
        }
    },
    deleteShipper:  async (args) => {
        try {
            
            let deletedShipper = await Shipper.deleteOne({_id:args.ShipperDelete._id});
            return deletedShipper
        } catch (error){
            throw new Error ('Error at delete Shipper' + error)
        }
    },
    
    orders:()=>{
        try {
            return Order.find();

        } catch(error){
            throw new Error("Error at geting all orders")
        }
    },

    getSpeceficOrder: async ({_id})=> {
        try {
           
            let user = await User.findById(_id);
            let relUser = await user;
            if(!relUser ) {
                throw new Error('This user does not exist while searching order for this user!')
                
            } else {
          
        
            let orders = await Order.find({ "_id": { "$in":relUser.orders } } );
            let relOrders = await orders
            
            return relOrders
            }
        } catch(error){
            throw  new Error("Error at finding order for specefic user" + error)
        }
    },
    getSpeceficOrderDetails: async ({_id})=>{
        try {

            let orderDetail = await OrderDetails.findOne({orderId:_id});
            let relOrderDetail = await orderDetail;
            
            if(!relOrderDetail ) {
                throw new Error('This shipper id doest not exist or somethig else went wrong!')
                
            } else {
        
            let count = {};
            relOrderDetail.productIds.forEach(function(i) { 
                count[i] = (count[i]||0) + 1
            
            });
            let product = await Product.find({ "_id": { "$in":relOrderDetail.productIds } } );
            let relProduct = await product
           
            let addedCoundPro = relProduct.map((pr)=>{
                
                for(rt in count ) {
                  
                    if(`"${pr._id}"` == `"${rt}"`) {
                        
                    return {productName: pr.productName, unitInStock:pr.unitInStock, unitPrice:pr.unitPrice, pictureUrl:pr.pictureUrl, counted:count[rt]}
                    }
                }
            })
            return addedCoundPro
            }
        } catch(error) {
            throw new Error("Error at getting order details "+ error)
        }
    },
    getSpeceficShipper: async ({_id})=>{
        try {
           
            let shipper = await Shipper.findById(_id);
            let relShipper = await shipper;
            if(!relShipper ) {
                throw new Error('We chould not fin this specefic shipper')
                
            } else {
    
            return relShipper
            }
        } catch(error){
            throw  new Error("Error at finding specefic shipper" + error)
        }
    },
    updateChoosenProduct: async(product) => {
        try {
           
            let foundProduct =  await Product.updateOne(
            {"_id":product.ProductUpdate._id},
            { unitInStock:product.ProductUpdate.unitInStock,
                unitPrice:product.ProductUpdate.unitPrice,
                pictureUrl:product.ProductUpdate.pictureUrl,
                description:product.ProductUpdate.description
            });
            let updatedProduct  = await foundProduct;
            
            let pro = await Product.findById(product.ProductUpdate._id);
            let relPro = await pro;
          
         
            if(!foundProduct ) {
                throw new Error('We chould not find this product')
                
            } else {
        
            return relPro 
            }
        } catch(error){
            throw  new Error("Error at finding specefic product" + error)
        }
    },
    
    subscriptions:()=>{
        try {
            return Subscription.find();

        } catch(error){
            throw new Error("Error at geting all Subscriptions")
        }
    },

    createSubscription: async (args) => {
        try {

            let SubscriptionRes = await Subscription.findOne({email:args.SubscriptionInput.email});
            let relShubscription = await SubscriptionRes 
            
            if(relShubscription) {
                throw new Error('Email Already Exist')
                
            } else {

                const subscription= new Subscription ({
                    email:args.SubscriptionInput.email
                   
                })
    
                return subscription.save();
            }
        } catch(error){
            throw  new Error("Error at creating new newsLetter " + error)
        }
    },

}
module.exports = Root;