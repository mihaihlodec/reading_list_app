const graphql = require('graphql');
const _ = require('lodash'); // library to search through arrays, etc
const Book = require('../models/book')
const Author = require('../models/author')
var ObjectId = require('mongoose').Types.ObjectId;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql; // we are taking out GraphQLObjectType
                                      // object from graphql package


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        //return _.find(authors, {id: parent.authorId});
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return _.filter(books, {authorId: parent.id});
        return Book.find({authorId: parent.id});
      }
    }
  })
});

//Root queries: how we can get into the graph - the first point of access
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args) {
        //return _.find(books, {id: args.id});
        console.log(Book.findById(args.id));
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        //return _.find(authors, {id: args.id});
        return Author.findById(new ObjectId(args.id));
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return books;
        return Book.find(); // return all when no param passed
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        //return authors;
        return Author.find();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)}, // NonNull
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save(); //power of mongoose
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
