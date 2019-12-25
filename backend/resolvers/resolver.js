const User = require('../models/user');
const Product = require('../models/product');
const Shipper = require('../models/shipper');
const bcrypt = require('bcryptjs');
const  Root ={
    
    users :()=>{
        return User.find();
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
        return Product.find();
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
    deleteProduct: async (args)=>{
        let foundProduct = await Product.findOne({_id:args.ProductDelete._id})
        let acFoundProduct = await foundProduct;
        if(!acFoundProduct){
            throw new Error ('Product does not exist!')
        }
        return Product.deleteOne({_id:args.ProductDelete._id})
    },
    shippers :()=>{
        return Shipper.find();
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
            throw error
        }
    },



}
module.exports = Root;