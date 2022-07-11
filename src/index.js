import { GraphQLServer } from "graphql-yoga"

// Type definition (schema)
const typeDefs = `
	type Query {
		hello: String!
		name: String!
		location: String!
		bio: String!
	}
`

// Resolvers
const resolvers = {
	Query: {
		hello() {
			return 'This is my first query...!'
		},
		name() {
			return 'Amitesh'
		},
		location() {
			return 'Italy'
		},
		bio() {
			return 'I live in Milan, love to stay here...!!!'
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
