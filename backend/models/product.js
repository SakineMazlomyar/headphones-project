const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
   productName: {
       type:String,
       required:true
   },
   unitInStock:{
       type:Number,
       required:true
   },
   unitPrice:{
       type:Number,
       required:true
   },
   pictureUrl:{
    type:String,
    required:true
   }
})

module.exports = mongoose.model('Product', product);