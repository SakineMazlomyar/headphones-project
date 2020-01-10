//The survey model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({

    shipFirstName: {
        type:String,
        required:true
    },
    shipLastName:{
        type:String,
        required:true
    },
    shippAdress:{
        type:String,
        required:true
    }, 
    shippPostelCode:{
        type:String,
        required:true
    },
    shipCity:{
        type:String,
        required:true
    },
    shipMail:{
        type:String,
        required:true
    },
    shipPhoneNo:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    orderDate:{
        type:String,
        required:true
    },
    createdOrder: {
            type:Schema.Types.ObjectId,
            ref:'User'

    },

    selectedShipper:{
            type:Schema.Types.ObjectId,
            ref:'Shipper'
    }
},
{timestamps:true}
)

module.exports = mongoose.model('Order', order);