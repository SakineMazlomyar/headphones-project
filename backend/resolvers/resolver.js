const User = require('../models/user');
const Product = require('../models/product');
const Shipper = require('../models/shipper');
const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const bcrypt = require('bcryptjs');

const findUser = async (userId) => {
    try {
        let u = await User.findById(userId)
        let relU = await u;
        console.log(relu, 'here is user')
        return {...relU._doc, _id:relU.id}
    } catch(error) {
        throw new Error('Error at getting specefic user' + error)
    }
}




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

    createProduct: async (args) => {
        try {

            let productRes = await Product.findOne({productName:args.ProductInput.productName, pictureUrl:args.ProductInput.pictureUrl});
            let relProduct = await productRes
            console.log(relProduct)
            if(relProduct) {
                throw new Error('Product alread exist')
                
            } else {

                const product = new Product ({
                    productName:args.ProductInput.productName,
                    unitInStock:args.ProductInput.unitInStock,
                    unitPrice:args.ProductInput.unitPrice,
                    pictureUrl:args.ProductInput.pictureUrl
                })
    
                return product.save();
            }
        } catch(error){
            throw error
        }
    },
    deleteProduct: async (args) => {
        try {
            
            let foundProduct = await Product.findOne({_id:args.ProductDelete._id})
            let acFoundProduct = await foundProduct;
            if(!acFoundProduct){
                throw new Error ('Product does not exist!')
            }
            return Product.deleteOne({_id:args.ProductDelete._id})
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
            console.log(relShippers)
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
            //console.log(relUser)
         
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
    }



}
module.exports = Root;