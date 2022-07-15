const Query = {
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
}

export { Query as default }
