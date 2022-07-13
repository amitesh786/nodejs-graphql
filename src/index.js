import { GraphQLServer } from "graphql-yoga"

// Type definition (schema)
const typeDefs = `
	type Query {
		add(numbers: [Float!]!): Float!
		grades: [Int]!
		me: User!
		post: Post!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		post: Post!
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
	}
`

// Resolvers
const resolvers = {
	Query: {
		add(parent, args, ctx, info) {
			if(args.numbers.length === 0) {
				return 0
			} 
			return args.numbers.reduce( (accumlator, currentValue) => {
				return accumlator + currentValue
			})
		},
		grades(parent, args, ctx, info) {
			return [99, 98, 92]
		},
		me() {
			return {
				id: 'abc1234',
				name: 'Amitesh',
				email: 'amitesh@gmail.com',
				post: {
					id: '123abc',
					title: '2 States',
					body: 'Details very good',
					published: true
				}
			}
		},
		post() {
			return {
				id: '123abc',
				title: '2 States',
				body: 'Details very good',
				published: true
			}
		}
	}
}

const server = new GraphQLServer({
	typeDefs: typeDefs,
	resolvers: resolvers
})

server.start(() => {
	console.log('server is up..!!!')
})
