import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import DatabaseHelper from '../../operations/databaseHelper.mjs';
import { ITEMS, MESSAGES, TIME } from '../../origin/coop.mjs';

export default class TransactionsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'transactions',
			group: 'economy',
			memberName: 'transactions',
			aliases: ['txh'],
			description: 'This command lets you check The Coop\'s past 500 transactions',
			details: `Details of the transactions command`,
			// TODO: Build a command to specify 1 transaction
			examples: ['transactions', '!transactions 123'],
			args: [
				{
					key: 'offset',
					prompt: 'Offset from the top (latest) records by how many records?',
					type: 'integer',
					default: 0
				},
			],
		});
	}


	// TODO/REVIEW: There are far more commands/angles/options for viewing transactions,
	// may need additional commands or parameters here later.
	async run(msg, { offset }) {
		super.run(msg);

		try {	
			const query = {
				name: 'get-transactions',
				text: `SELECT * FROM item_qty_change_history 
					ORDER BY id DESC
					LIMIT 10 OFFSET $1`.trim(),
				values: [offset]
			};
	
			const result = await DatabaseHelper.manyQuery(query);
			
			const nowSecs = TIME._secs();
			const txHistText = `**Latest ${offset}-${offset + 10} transactions:**\n\n` +
				result.map(txC => 
					`#${txC.id} ${TIME.humaniseSecs(nowSecs - txC.occurred_secs)} ago <@${txC.owner}>'s ` + 
					`${txC.change > 0 ? '+' : ''}${ITEMS.displayQty(txC.change)}x${txC.item} ` +
					`${MESSAGES.emojiCodeText(txC.item)} ${txC.change > 0 ? '->' : '<-'} ` + 
					`Coop's ${ITEMS.displayQty(txC.running)} - _${txC.note}_`
				).join('\n') + '\n\n_!transactions or !txh to check transaction history again. TODO: Add inspect tx command._';

			MESSAGES.silentSelfDestruct(msg, txHistText, 0, 20000);

		} catch(e) {
			console.log('Failed to retrieve The Coop\'s latest transactions.');
			console.error(e);
		}
    }
    
}
