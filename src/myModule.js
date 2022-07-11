// named export - has a name
// default export - has no name
const msg = 'Some message mymodule.js'

const name = 'Amitesh'

const location = 'Italy'

const getGreeting = (name) => {
	return `Welcome to course ${name}`
}

export {
	msg,
	name,
	location as default,
	getGreeting
}