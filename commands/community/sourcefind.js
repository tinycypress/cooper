import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';


export default class SourceFindCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sourcefind',
			group: 'community',
			memberName: 'sourcefind',
			aliases: ['srcf', 'sourcef'],
			description: 'Search within the source code.',
			details: ``,
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
				.replace('!sourcefind', '')
				.replace('!srcf', '')
				.replace('!sourcef', '')

			// Format for searching.
			const fmtQuery = encodeURIComponent(query).replace(/\-/g, '+')

			// Append the search query to URL.
			const gitBaseUrl = `https://github.com/lmf-git/cooper/`;
			MESSAGES.selfDestruct(`**Source query result (${query}):**\n` + 
				gitBaseUrl + 'search?q=' + fmtQuery);


		} catch(e) {
			console.error(e);
		}
    }
    
}