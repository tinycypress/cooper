import { SlashCommandBuilder } from "@discordjs/builders";
import COOP, { USABLE } from '../../origin/coop.mjs';
import { EMOJIS } from '../../origin/config.mjs';

export const name = 'items';

export const description = 'Check item ownership';
    
// TODO: Support checking another player's items.
export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addUserOption(option => 
		option
			.setName('target')
			.setDescription('Whose items? (default yours)')
	)
	.addStringOption(option => 
		option
			.setName('item_code')
			.setDescription('Item code? (default ALL)')
	);


export const execute = async (interaction) => {
	let itemCode = interaction.options.get('item_code').value ?? 'ALL';
	let target = interaction.options.get('target').value ?? interaction.user;

	console.log(itemCode);
	console.log(target);

	// Try to interpret itemCode/itemEmoji arg
	const itemInput = COOP.ITEMS.interpretItemCodeArg(itemCode);

	try {
		const name = target.username;

		// Retrieve all item counts that user owns.
		if (itemCode === 'ALL') {
			const noItemsMsg = `${name} does not own any items.`;
			const items = await COOP.ITEMS.getUserItems(target.id);
			if (items.length === 0) return await interaction.reply(noItemsMsg, { ephemeral: true });
			else {
				// Sort owned items by most first.
				items.sort((a, b) => (a.quantity < b.quantity) ? 1 : -1);

				// Crop items so a text overflow error does not happen.

				const itemDisplayMsg = COOP.ITEMS.formItemDropText(target, items);

				// Add website link prompt.

				return await interaction.reply(itemDisplayMsg, { ephemeral: true });
			}
		}

		// Check if itemCode valid to use.
		if (!USABLE.isUsable(itemInput))
			return await interaction.reply(`${name}, ${itemInput} seems invalid.`, { ephemeral: true });

		// Check a specific item instead.
		const itemQty = await COOP.ITEMS.getUserItemQty(target.id, itemInput);
		const displayQty = COOP.ITEMS.displayQty(itemQty);

		// Send specific item count.
		const emoji = COOP.MESSAGES.emojiText(EMOJIS[itemInput]);
		if (itemQty > 0)  
			return await interaction.reply(`${name} owns ${displayQty}x${itemInput} ${emoji}.`, { ephemeral: true });
		else 
			return await interaction.reply(`${name} does not own any ${itemInput}.`, { ephemeral: true });

	} catch(err) {
		console.error(err);
		return await interaction.reply(`Error getting item ownership info.`, { ephemeral: true });
	}

};