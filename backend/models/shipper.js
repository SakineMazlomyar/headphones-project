const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipper = new Schema({
   companyName: {
       type:String,
       required:true
   },
   shippingPrice: {
    type:Number,
    required:true
   },
   shippingMethod: {
       type:String,
       require:true
   }
})

module.exports = mongoose.model('Shipper', shipper);