const User = require('../models/user');
const Product = require('../models/product')
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
                password:password
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
        
        return{userId:user._id, email:user.email};
    }catch(error){
        console.log('Error at sign in '+ error)
    }
  },

  products :()=>{
        return Product.find();
    },

createProduct:()=>{
    
}



}
module.exports = Root;