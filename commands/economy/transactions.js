import CoopCommand from '../../operations/activity/messages/coopCommand';
import DatabaseHelper from '../../operations/databaseHelper';
import { MESSAGES } from '../../origin/coop';
import Database from '../../origin/setup/database';

export default class TransactionsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'transactions',
			group: 'economy',
			memberName: 'transactions',
			aliases: [],
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

	async run(msg, { offset }) {
		super.run(msg);

		try {
			MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, transactions history is WIP.`);
			
			const query = {
				name: 'get-transactions',
				text: `SELECT * FROM item_qty_change_history LIMIT 20`.trim(),
				values: [pos]
			};
	
			// const result = await Database.query(query);
			// const rows = DatabaseHelper.many(result);
	
			// return rows;

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
