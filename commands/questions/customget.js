const Commando = require('discord.js-commando');

module.exports = class CustomGetCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'custom',
			aliases: ['c'],
			group: 'questions',
			memberName: 'custom',
			description: 'Custom commands.',
			examples: ['custom [name]', 'c [name]'],
			guildOnly: true,

			args: [
				{
					key: 'name',
					prompt: 'Custom command name?',
					type: 'string',
					infinite: false,
					wait: 60
				}
			]
		});
	}

	async run(msg, args) {
		if (!msg.client || !msg.guild) {
			return;
		}
		const provider = msg.client.provider;
		if (!provider) {
			return;
		}
		const guild = msg.guild;
		const name = args.name.toLowerCase();
		const notFound = `Custom command ${name} not found. Use !l[ist]c[ustom] to list.`;
		let val;
		try {
			val = provider.get(guild, name, notFound);
		} catch (err) {
			console.error(err);
			return msg.reply('Had an error! Contact willyb321#2816');
		}

		if (!val || val === notFound) {
			return msg.reply(notFound);
		}
		console.log(`Found custom command ${name} with value ${val.toString()}`);
		return msg.channel.send(val);
	}
};
