import { GraphQLServer } from "graphql-yoga"
import uuidv4 from 'uuid/v4'

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
		published: true,
		author: '1'
	},
	{
		id: 'abc123',
		title: '3 Book',
		body: 'Not good',
		published: false,
		author: '1'
	},
	{
		id: 'zxcabc',
		title: 'GraphQL',
		body: 'Fair',
		published: true,
		author: '2'
	}
];

const comments = [
	{
		id: '110',
		text: 'Hello write as much',
		author: '1',
		post: '123abc'
	},
	{
		id: '220',
		text: 'much well knows',
		author: '1',
		post: 'abc123'
	},
	{
		id: '330',
		text: 'write what you know',
		author: '2',
		post: 'zxcabc'
	}
];


// Type definition (schema)
const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		comments: [Comment!]!
		me: User!
		post: Post!
		comment: Comment!
	}

	type Mutation {
		createUser(data: CreateUserInput!): User!
		createPost(data: CreatePostInput!): Post!
		createComment(data: CreateCommentInput!): Comment!
	}

	input CreateUserInput {
		name: String!,
		email: String!,
		age: Int
	}

	input CreatePostInput {
		title: String!,
		body: String!, 
		published: Boolean!, 
		author: ID!
	}

	input CreateCommentInput {
		text: String!, 
		author: ID!, 
		post: ID!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
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
		comments(parent, args, ctx, info) {
			if (!args.query) {
				return comments
			}

			return comments.filter((comment) => {
				return comment.text.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
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
		},
		comment() {
			return {
				id: '1',
				text: 'hello add as much'
			}
		}
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			console.log(args)
			const emailTaken = users.some((user) => user.email === args.data.email)
			
			if (emailTaken) {
				throw new Error('Email taken.!!!')
			}

			const user = { 
				id: uuidv4(), 
				...args.data
			}
			users.push(user)
			return user
		},
		createPost(parent, args, ctx, info) {
			console.log(args)

			const userExists = users.some((user) => user.id === args.data.author)
			
			if (!userExists) {
				throw new Error('User not found.!!!')
			}

			const post = {
				id: uuidv4(), 
				...args.data
			}

			posts.push(post)
			return post
		},
		createComment(parent, args, ctx, info) {
			console.log(args)

			const userExists = users.some( (user) => user.id === args.data.author)
			const postExits = posts.some( (post) => post.id === args.data.post && post.published)
			
			if (!userExists || !postExits) {
				throw new Error('Unable to find user and post')
			}

			const comment = {
				id: uuidv4(), 
				...args.data
			}

			comments.push(comment)
			return comment
		}
	},
	Post: {
		author(parent, args, ctx, info) {

			return users.find((user) => {
				return user.id === parent.author
			})
		},
		comments(parent, args, ctx, info) {

			return comments.filter( (comment) => {
				return comment.post === parent.id
			})
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter( (post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, ctx, info) {
			return comments.filter( (comment) => {
				return comment.author === parent.id
			})
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
		post(parent, args, ctx, info) {
			console.log(parent)

			return posts.find( (post) => {
				return post.id === parent.post
			})
		},
	}
}

const server = new GraphQLServer({
	typeDefs: typeDefs,
	resolvers: resolvers
})

server.start(() => {
	console.log('server is up..!!!')
})
