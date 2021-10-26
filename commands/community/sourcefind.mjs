import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { MESSAGES } from '../../origin/coop.mjs';


export default class SourceFindCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sourcefind',
			group: 'community',
			memberName: 'sourcefind',
			aliases: ['srcf', 'sourcef'],
			description: 'Search within the source code.',
			examples: ['!sourcef ITEMS.add()'],
			args: [
				{
					key: 'query',
					prompt: 'Please provide search query text',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		super.run(msg);

		try {
			query = query
				.replace('!sourcefind ', '')
				.replace('!srcf ', '')
				.replace('!sourcef ', '')

			// Format for searching.
			const fmtQuery = encodeURIComponent(query.replace(/ /g, '+'))

			// Append the search query to URL.
			const gitBaseUrl = `https://github.com/lmf-git/cooper`;
			MESSAGES.selfDestruct(msg, `**Source query result (${query}):**\n` + 
				`<${gitBaseUrl}/search?q=${fmtQuery}>`, 0, 25000);


		} catch(e) {
			console.error(e);
		}
    }
    
}