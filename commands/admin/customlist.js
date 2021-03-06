const Commando = require('discord.js-commando');
const getUrls = require('get-urls');
const _ = require('lodash');

const truncateString = (str, num) =>
	str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
module.exports = class CustomGetCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'listcustom',
			aliases: ['lc'],
			group: 'questions',
			memberName: 'listcustom',
			description: 'List custom commands.',
			examples: ['listcustom', 'lc'],
			guildOnly: true
		});
	}

	async run(msg) {
		if (!msg.client || !msg.guild) {
			return;
		}
		const provider = msg.client.provider;
		if (!provider) {
			return;
		}
		if (!provider.db) {
			return;
		}

		msg.client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', msg.guild.id)
			.then(elem => {
				try {
					if (!elem) {
						return msg.channel.send('No custom settings found. Add one with the !s[et]c[ustom] command');
					}
					elem = JSON.parse(elem.settings);
					let keys = Object.keys(elem);
					keys = keys.sort();
					let reply = 'Custom commands list:\n';
					keys.forEach(key => {
						if (key.startsWith('twitch_')) {
							return;
						}
						if (key.startsWith('builds_')) {
							return;
						}
						if (key.startsWith('guides_')) {
							return;
						}
						if (key.startsWith('settings_')) {
							return;
						}
						elem[key] = truncateString(elem[key].replace(/\n/igm, ' '), 35);
						elem[key] = elem[key].replace(/`/igm, '');
						getUrls(elem[key]).forEach(url => {
							elem[key] = elem[key].replace(url, `<${url}>`);
						});

						reply += `${key.replace(' ', '')} - \`${elem[key]}\`\n`;
					});
					return msg.channel.send(reply, {split: true});
				} catch (err) {
					console.error(err);
					return msg.channel.send('Had an error. Contact willyb321#2816');
				}
			})
			.catch(err => {
				console.error(err);
				return msg.channel.send('Had an error. Contact willyb321#2816');
			});
	}
};
