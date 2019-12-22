const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetails = new Schema({
   quentity: {
       type:Number,
       required:true
   },
   orderIds: [{

    type:Schema.Types.ObjectId,
    ref:'Order'
     
    }],

    productIds : [{
        type:Schema.Types.ObjectId,
        ref:'Product'
    
    }]
})

module.exports = mongoose.model('OrderDetails', orderDetails);