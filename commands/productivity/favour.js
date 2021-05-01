import CoopCommand from '../../operations/activity/messages/coopCommand';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import { MESSAGES, TIME, USERS } from '../../origin/coop';

export default class FavourCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'favour',
			group: 'productivity',
			memberName: 'favour',
			aliases: ['fav'],
			description: 'Information favour our fine community!',
			details: `Details`,
			examples: ['favour', 'favour example?'],
			args: [
				{
					key: 'target',
					prompt: 'The user you want to request the favour from.',
					type: 'user'
				},
				{
					key: 'title',
					prompt: 'The favour\'s TODO title?',
					type: 'string'
				},
				{
					key: 'due',
					prompt: 'TODO deadline future time? Ex. next Tuesday, 3pm Wednesday, in 30 minutes, in half a year... etc',
					type: 'string'
				},
				{
					key: 'category',
					prompt: 'TODO category? (all)',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { target, title, due, category }) {
		super.run(msg);

		// Prevent invalid member.
		const member = USERS._get(target.id);
		const invalidTarget = `<@${msg.author.id}>, invalid target user for adding favour.`
		if (!member)
			return MESSAGES.silentSelfDestruct(msg, invalidTarget, 0, 7500);

		// Take human readable due time.
		const dueDate = TIME.parseHuman(due);

		// Convert category to lower case for better matches.
		category = category.toLowerCase();

		// Invalid input time feedback
		if (isNaN(dueDate))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${due} is invalid duration for the favour task.`);

		// TODO: Integrate complexity system!! Get people to rank how hard their tasks are.


		// Calculate unix secs for due/deadline.
		const dueSecs = Math.round(dueDate.getTime() / 1000);

		// Prevent too long of a deadline.
		if (dueSecs >= TIME._secs() + 3.154e+7)
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, your deadline is too long (has to be less than a year).`);


		// Add a TODO for this user.
		const result = await TodoHelper.add(target.id, {
			title: 'Favour - ' + title, 
			due: dueSecs, 
			category
		});
		
		// Handle already exists error
		if (result === 'ALREADY_EXISTS')
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, your target already has a todo with that title.!`);
		
		// Feedback.
		const secsNow = TIME._secs();
		const deadline = TIME.humaniseSecs(Math.max(dueSecs - secsNow, 0));
		return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, your favour was added to <@${target.id}>!\n\n` +
			title +
			`\n\nDeadline: ${deadline}`);
    }
}