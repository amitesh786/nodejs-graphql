import { GraphQLServer } from "graphql-yoga"

// Demo user data
const users = [
	{
		id: '1',
		name: 'Amitesh',
		email: 'amitesh@gmail.com',
		age: 27
	},
	{
		id: '2',
		name: 'Singh',
		email: 'singh@gmail.com',
		age: 30
	},
	{
		id: '3',
		name: 'Princi',
		email: 'princi@gmail.com',
		age: 24
	},
];

const posts = [
	{
		id: '123abc',
		title: '2 States',
		body: 'Very good',
		published: true
	},
	{
		id: 'abc123',
		title: '3 Book',
		body: 'Not good',
		published: false
	},
	{
		id: 'zxcabc',
		title: 'GraphQL',
		body: 'Fair',
		published: true
	}
];

// Type definition (schema)
const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		me: User!
		post: Post!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
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
		users(parent, args, ctx, info) {
			if (!args.query) {
				return users
			}

			return users.filter((user) => {
				return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
			})
		},
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts
			}

			return posts.filter((post) => {
				const titleMatch = post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
				const bodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
				return titleMatch || bodyMatch
			})
		},
		me() {
			return {
				id: 'abc1234',
				name: 'Amitesh',
				email: 'amitesh@gmail.com'
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
