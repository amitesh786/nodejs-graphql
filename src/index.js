import { GraphQLServer } from "graphql-yoga"

// Type definition (schema)
const typeDefs = `
	type Query {
		id: ID!
		name: String!
		age: Int!
		employed: Boolean!
		gpa: Float
		title: String!
		price: Float!
		releaseYear: Int
		rating: Float
		inStock: Boolean!
	}
`

// Resolvers
const resolvers = {
	Query: {
		id() {
			return 'abc123'
		},
		name() {
			return 'Amitesh'
		},
		age() {
			return 31
		},
		employed() {
			return true
		},
		gpa() {
			return null
		},
		title() {
			return 'Product name'
		},
		price() {
			return 2.222
		},
		releaseYear() {
			return null
		},
		rating() {
			return 4
		},
		inStock() {
			return true
		}

	}
}

const server = new GraphQLServer({
	typeDefs: typeDefs,
	resolvers: resolvers
})

server.start( () => {
	console.log('server is up..!!!')
})
