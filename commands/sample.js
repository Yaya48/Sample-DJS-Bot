module.exports = {
	name : 'sample',
	category: 'None',
	description: 'This is a sample command.',
	async execute(client, message, args) {
		// Your command code here.
		message.channel.send('test')
	}
}