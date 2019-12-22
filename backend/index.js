const express = require('express');
//clrequire('./connection').initilise();
const bodyParser = require('body-parser');
let path = require('path');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* #4 GraphQL + MongoDB | Build a Complete App with GraphQL, Node.js, MongoDB and React.js */
const products = []
let schema = buildSchema (`

    type Product {
        _id: ID!
        productName:String!
        unitInStock:Int!
        unitPrice:Float!
        pictureUrl:String!
    }


    input ProductInput {
        productName:String!
        unitInStock:Int!
        unitPrice:Float!
        pictureUrl:String!
    }

    type RootQuery {
    products: [Product!]!

    }

    type RootMutation {
    createProducts(ProductInput:ProductInput):Product

    }
    schema {
    query:RootQuery
    mutation:RootMutation
    }
`);

let root = {
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
  }

}

app.use('/graphql',graphqlHTTP({
  schema:schema,
  graphiql:true,
  rootValue: root,
}))








const port = 5000;
let portInfo = app.listen(port,()=>{ console.log('Server started at port: '+ portInfo.address().port)})