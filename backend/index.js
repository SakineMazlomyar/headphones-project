const express = require('express');
//clrequire('./connection').initilise();
const bodyParser = require('body-parser');
let path = require('path');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let schema = buildSchema (`
  type RootQuery {
    events: [String!]!
  }

  type RootMutation {
    createEvents(name:String):String

  }
  schema {
    query:RootQuery
    mutation:RootMutation
  }
`);

let root = {
  events: () => {
    return ['Sakine']
  },

  createEvents: (args) => {
    return args.name
  }

}

app.use('/graphql',graphqlHTTP({
  schema:schema,
  graphiql:true,
  rootValue: root,
}))








const port = 5000;
let portInfo = app.listen(port,()=>{ console.log('Server started at port: '+ portInfo.address().port)})