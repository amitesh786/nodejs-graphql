import uuidv4 from 'uuid/v4'

const Mutation = {
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
	updateUser(parent, args, {db}, info) {
		console.log(args)
		const { id, data } = args
		const user = db.users.find( (user) => user.id === id)

		if (!user) {
			throw new Error("User not found...!!!")
		}

		if (typeof data.email === 'string') {
			const emailTaken = db.users.some( (user) => user.email === data.email)

			if (emailTaken) {
				throw new Error("Email already use...!!!")
			}
			user.email = data.email
		}

		if(typeof data.name === 'string') {
			user.name = data.name
		}

		if (typeof data.age !== 'undefined') {
			user.age = data.age
		}
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
	createPost(parent, args, {db, pubsub}, info) {
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

		if(args.data.published) {
			pubsub.publish('post', {post})
		}
		return post
	},
	updatePost(parent, args, {db}, info) {
		console.log(args)

		const { id, data } = args
		const post = db.posts.find( (post) => post.id === id)

		if (!post) {
			throw new Error("Post not found...!!!")
		}

		if (typeof data.title === 'string') {
			post.title = data.title
		}

		if(typeof data.body === 'string') {
			post.body = data.body
		}

		if (typeof data.published === 'boolean') {
			post.published = data.published
		}

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
	createComment(parent, args, {db, pubsub}, info) {
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
		pubsub.publish(`comment ${args.data.post}`, {comment})
		return comment
	},
	updateComment(parent, args, {db}, info) {
		console.log(args)
		const { id, data } = args

		const comment = db.comments.find( (comment) => comment.id === id)

		if (!comment) {
			throw new Error("Comment not found...!!!")
		}

		if (typeof data.text === 'string') {
			comment.text = data.text
		}
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
}

export { Mutation as default }
