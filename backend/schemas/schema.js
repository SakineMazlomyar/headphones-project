const { buildSchema } = require('graphql');
let schema = buildSchema (`
    type User {
        _id: ID!
        email:String!
        password:String
        username:String!
    }
    type Product {
        _id: ID!
        productName: String!
        unitInStock:Int!
        unitPrice:Int!
        pictureUrl:String!
    }
    
    input UserInput {
        email:String!
        password:String!
        username:String!
    }
    
    type AuthData {
        userId: ID!
        email:String!
        username:String!
    }

   input ProductInput {
        productName: String!
        unitInStock:Int!
        unitPrice:Int!
        pictureUrl:String!
    }

    input ProductDelete {
        _id: ID!
    }

    type RootQuery {
        users: [User!]!
        login(email: String!, password: String!): AuthData!
        products:[Product!]!
      

    }
    

    type RootMutation {
        createUser(UserInput:UserInput):User
        createProduct(ProductInput: ProductInput):Product
        deleteProduct(ProductDelete:ProductDelete):Product

    }
    schema {

        query:RootQuery
        mutation:RootMutation
    }
`);
module.exports = schema;