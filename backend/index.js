const express = require('express');
require('./connection').initilise();
const bodyParser = require('body-parser');
let path = require('path');
const graphqlHTTP = require('express-graphql');



let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const User = require('./models/user');
const Root  = require('./resolvers/resolver');
const Schema = require('./schemas/schema')


app.use('/graphql',graphqlHTTP({
    schema:Schema ,
    graphiql:true,
    rootValue: Root,
}))






/* 
products: () => {
        return products
    },
    createProducts: (args) => {
    const product = {
        _id: Math.random().toString(),
        productName:args.ProductInput.productName,
        unitInStock:args.ProductInput.unitInStock,
        unitPrice:args.ProductInput.unitPrice,
        pictureUrl:args.ProductInput.pictureUrl

        }

        products.push(product)
        return product
    },


*/

const port = 5000;
let portInfo = app.listen(port,()=>{ console.log('Server started at port: '+ portInfo.address().port)})