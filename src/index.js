import { GraphQLServer } from "graphql-yoga"
import uuidv4 from 'uuid/v4'
import db from './db'

// Resolvers
const resolvers = {
	Query: {
		users(parent, args, { db }, info) {
			if (!args.query) {
				return db.users
			}

			return db.users.filter((user) => {
				return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
			})
		},
		posts(parent, args, {db}, info) {
			if (!args.query) {
				return db.posts
			}

			return db.posts.filter((post) => {
				const titleMatch = post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
				const bodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
				return titleMatch || bodyMatch
			})
		},
		comments(parent, args, {db}, info) {
			if (!args.query) {
				return db.comments
			}

			return db.comments.filter((comment) => {
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
		createUser(parent, args, {db}, info) {
			console.log(args)
			const emailTaken = db.users.some((user) => user.email === args.data.email)
			
			if (emailTaken) {
				throw new Error('Email taken.!!!')
			}

			const user = { 
				id: uuidv4(), 
				...args.data
			}
			db.users.push(user)
			return user
		},
		deleteUser(parent, args, {db}, info) {
			console.log(args)

			const userIndex = db.users.findIndex( (user) => user.id === args.id)

			if(userIndex === -1) {
				throw new Error('User not found.!!!')
			}

			const deleteUsers = db.users.splice(userIndex, 1)

			posts = db.posts.filter( (post) => { 
				let match = post.author === args.id 

				if (match) {
					comments = db.comments.filter( (comment) => comment.post !== post.id)
				}
				return !match			
			})

			comments = db.comments.filter( (comment) => comment.author !== args.id)

			return deleteUsers[0]
		},
		createPost(parent, args, {db}, info) {
			console.log(args)

			const userExists = db.users.some((user) => user.id === args.data.author)
			
			if (!userExists) {
				throw new Error('User not found.!!!')
			}

			const post = {
				id: uuidv4(), 
				...args.data
			}

			db.posts.push(post)
			return post
		},
		deletePost(parent, args, {db}, info) {
			console.log(args)

			const postIndex = db.posts.findIndex( (post) => post.id === args.id)

			if(postIndex === -1) {
				throw new Error('Post not found.!!!')
			}

			const deletePosts = db.posts.splice(postIndex, 1)

			comments = db.comments.filter( (comment) => comment.post !== args.id)

			return deletePosts[0]
		},
		createComment(parent, args, {db}, info) {
			console.log(args)

			const userExists = db.users.some( (user) => user.id === args.data.author)
			const postExits = db.posts.some( (post) => post.id === args.data.post && post.published)
			
			if (!userExists || !postExits) {
				throw new Error('Unable to find user and post')
			}

			const comment = {
				id: uuidv4(), 
				...args.data
			}

			db.comments.push(comment)
			return comment
		},
		deleteComment(parent, args, {db}, info) {
			console.log(args)

			const commentIndex = db.comments.findIndex( (comment) => comment.id === args.id)

			if(commentIndex === -1) {
				throw new Error('Comment not found.!!!')
			}

			const deleteComments = db.comments.splice(commentIndex, 1)
			return deleteComments[0]
		}
	},
	Post: {
		author(parent, args, {db}, info) {

			return db.users.find((user) => {
				return user.id === parent.author
			})
		},
		comments(parent, args, {db}, info) {

			return db.comments.filter( (comment) => {
				return comment.post === parent.id
			})
		}
	},
	User: {
		posts(parent, args, {db}, info) {
			return db.posts.filter( (post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, {db}, info) {
			return db.comments.filter( (comment) => {
				return comment.author === parent.id
			})
		}
	},
	Comment: {
		author(parent, args, {db}, info) {
			return db.users.find((user) => {
				return user.id === parent.author
			})
		},
		post(parent, args, {db}, info) {
			console.log(parent)

			return db.posts.find( (post) => {
				return post.id === parent.post
			})
		},
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: resolvers,
	context: {
		db
	}
})

server.start(() => {
	console.log('server is up..!!!')
})
