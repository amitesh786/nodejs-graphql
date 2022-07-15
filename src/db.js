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

const db = {
	users,
	posts,
	comments
}

export { db as default }
