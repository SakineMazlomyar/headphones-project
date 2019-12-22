const User = require('../models/user');
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
                console.log('Error Password '+ error)
                throw error
        })


    }

}
module.exports = Root;