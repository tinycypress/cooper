import { SlashCommandBuilder } from "@discordjs/builders";
import COOP  from '../../origin/coop.mjs';

import { 
	validItemQtyArgFloatGuard, usableItemCodeGuard 
} from '../../operations/minigames/medium/economy/itemCmdGuards.mjs';

import FlareHandler from '../../operations/minigames/medium/economy/items/handlers/flareHandler.mjs';
import LaxativeHandler from '../../operations/minigames/medium/economy/items/handlers/laxativeHandler.mjs';
import ShieldHandler from '../../operations/minigames/medium/economy/items/handlers/shieldHandler.mjs';
import RPGHandler from '../../operations/minigames/medium/economy/items/handlers/rpgHandler.mjs';
import EasterEggHandler from '../../operations/minigames/medium/economy/items/handlers/easterEggHandler.mjs';
import GoldCoinHandler from '../../operations/minigames/medium/economy/items/handlers/goldCoinHandler.mjs';
import MineHandler from '../../operations/minigames/medium/economy/items/handlers/mineHandler.mjs';
import DefuseKitHandler from '../../operations/minigames/medium/economy/items/handlers/defuseKitHandler.mjs';

export const name = 'use';

export const description = 'Use items you own';

// TODO: Support checking another player's items.
export const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
	.addStringOption(option => 
		option
			.setName('item_code')
			.setDescription('Use which item [ITEM_CODE or item emoji]')
	)
	.addIntegerOption(option => 
		option
			.setName('item_qty')
			.setDescription('Use how many?')
	);


export const execute = async (interaction) => {
	let itemCode = interaction.options.get('item_code').value ?? null;
	let qty = interaction.options.get('item_qty').value ?? null;

    // Guard to a proper float input.
    qty = parseFloat(qty);
    
    if (!validItemQtyArgFloatGuard(interaction.channel, interaction.user, qty))
        return null;

    // Interpret item code from text/string/emoji/item_code.
    itemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

    // Usable item guard
    if (!usableItemCodeGuard(interaction.channel, itemCode, interaction.user.username))
        return null;

    // Item is usable, therefore use it.
    if (itemCode === 'LAXATIVE') LaxativeHandler.use(interaction.channel, interaction.user);
    if (itemCode === 'FLARE') FlareHandler.use(interaction.channel, interaction.user);
    if (itemCode === 'SHIELD') ShieldHandler.use(interaction.channel);

    
    if (itemCode === 'RPG') RPGHandler.use(interaction.channel); // TODO: WIP
    if (itemCode === 'EASTER_EGG') EasterEggHandler.use(interaction.channel, interaction.user); // TODO: WIP
    if (itemCode === 'GOLD_COIN') GoldCoinHandler.use(interaction.channel, interaction.user); // TODO: WIP
    if (itemCode === 'MINE') MineHandler.use(interaction.channel, interaction.user);
    if (itemCode === 'DEFUSE_KIT') DefuseKitHandler.use(interaction.channel, interaction.user);
}
