const { buildSchema } = require('graphql');
let schema = buildSchema (`
    type User {
        _id: ID!
        email:String!
        password:String
    }

    input UserInput {
        email:String!
        password:String!
    }
    
    type AuthData {
        userId: ID!
        email:String!
    }


    type RootQuery {
        users: [User!]!
        login(email: String!, password: String!): AuthData!

    }

    type RootMutation {

        createUser(UserInput:UserInput):User

    }
    schema {

        query:RootQuery
        mutation:RootMutation
    }
`);
module.exports = schema;