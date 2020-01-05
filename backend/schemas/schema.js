const { buildSchema } = require('graphql');
let schema = buildSchema (`
    type User {
        _id: ID!
        email:String!
        password:String
        username:String!
        orders:[Order!]
    }
    type Product {
        _id: ID!
        productName: String!
        unitInStock:Int!
        unitPrice:Int!
        pictureUrl:String!
        description:String!
    }
    type Producttr {
        _id: ID!
        productName: String!
        unitInStock:Int!
        unitPrice:Int!
        pictureUrl:String!
        counted:Int!
        
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

    type Shipper {
        _id: ID!
        companyName:String!
        shippingPrice:Int!
        shippingMethod:String!
    }

    type Order {
        _id: ID!
        shipFirstName: String!
        shipLastName: String!
        shippAdress: String!
        shippPostelCode: String!
        shipCity: String!
        shipMail: String!
        shipPhoneNo: String!
        totalPrice: Int!
        orderDate: String!
        createdOrder: String!
        selectedShipper: String!
        createdAt: String!
        updatedAt: String!
        
    }
    type ProductDeleted {
        n: Int!
        ok: Int!
        deletedCount:Int!
        
    }
    type ShipperDeleted {
        n: Int!
        ok: Int!
        deletedCount:Int!
        
    }
  
    input ShipperUpdate {
        _id: ID!
        companyName:String!
        shippingPrice:Int!
        shippingMethod:String!
    }
   input ProductInput {
        productName: String!
        unitInStock:Int!
        unitPrice:Int!
        pictureUrl:String!
        description:String!
    }
   input ProductUpdate {
        _id: ID!
        productName: String!
        unitInStock:Int!
        unitPrice:Int!
        pictureUrl:String!
        description:String!
    }

    input ProductDelete {
        _id: ID!
        
    }

    input ShipperDelete {
        _id: ID!
        
    }

   


    input ShipperInput {
        companyName:String!
        shippingPrice:Int!
        shippingMethod:String!
    }

    input OrderInput {
        shipFirstName:String!
        shipLastName:String!
        shippAdress:String!
        shippPostelCode:Int!
        shipCity:String!
        shipMail:String!
        shipPhoneNo:String!
        totalPrice:Int!
        orderDate: String!
        createdOrder:String!
        selectedShipper:String!

    }

    

    type RootQuery {
        users: [User!]!
        login(email: String!, password: String!): AuthData!
        products:[Product!]!
        shippers:[Shipper!]!
        orders:[Order!]!
        getSpeceficOrder(_id:ID!):[Order!]!
        getSpeceficOrderDetails(_id:ID!): [Producttr!]!
        getSpeceficShipper(_id:ID!):Shipper!
      
    }
    

    type RootMutation {
        createUser(UserInput:UserInput):User
        createProduct(ProductInput: ProductInput):Product
        deleteProduct(ProductDelete:ProductDelete): ProductDeleted
        createShipper(ShipperInput: ShipperInput):Shipper
        createOrder(OrderInput: OrderInput):Order
        updateChoosenProduct(ProductUpdate: ProductUpdate):Product
        updateChoosenShipper(ShipperUpdate: ShipperUpdate):Shipper
        deleteShipper(ShipperDelete: ShipperDelete):ShipperDeleted

    }
    schema {

        query:RootQuery
        mutation:RootMutation
    }
`);
module.exports = schema;