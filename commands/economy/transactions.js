import CoopCommand from '../../operations/activity/messages/coopCommand';
import DatabaseHelper from '../../operations/databaseHelper';
import { ITEMS, MESSAGES } from '../../origin/coop';

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
					LIMIT 20 OFFSET $1`.trim(),
				values: [offset]
			};
	
			const result = await DatabaseHelper.manyQuery(query);
			

			const txHistText = `**Latest ${offset + 20} item changes:**\n\n` +
				result.map(txC => 
					`#${txC.id} <@${txC.owner}>'s ` + 
					`${ITEMS.displayQty(txC.change)}x${txC.item} ` +
					`${MESSAGES._displayEmojiCode(txC.item)} -> ` + 
					`Coop's ${ITEMS.displayQty(txC.running)} - _${txC.note}_`
				).join('\n') + '\n\n_!transactions or !txh to check transaction history again._';

			MESSAGES.silentSelfDestruct(msg, txHistText, 0, 20000);

			// CREATE TABLE item_qty_change_history( 
			//     id SERIAL PRIMARY KEY, 
			//     owner VARCHAR, 
			//     item VARCHAR, 
			//     running float,
			//     change float,
			//     note VARCHAR
			// );

		} catch(e) {
			console.log('Failed to retrieve The Coop\'s latest transactions.');
			console.error(e);
		}
    }
    
}
