const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema'); // auto .js
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

//allow cros-origin request
app.use(cors());

 // TODO: set the correct credentials for DB connection
mongoose.connect('');
mongoose.connection.once('open', () => {
  console.log('connected to DB');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // when someone hits /graphql redirect to graphiql tool
}));

app.listen(4000, () => {
  console.log('now listening for requests on port 4000');
});
