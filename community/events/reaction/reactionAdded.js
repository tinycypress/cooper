import EMOJIS from '../../../core/config/emojis.json';

import EggHuntMinigame from "../../features/minigame/small/egghunt";
import CratedropMinigame from "../../features/minigame/small/cratedrop";
import MiningMinigame from "../../features/minigame/small/mining";
import WoodcuttingMinigame from '../../features/minigame/small/woodcutting';


import RedemptionHelper from "../../features/redemption/redemptionHelper";
import SacrificeHelper from "../../features/events/sacrificeHelper";
import ItemsHelper from "../../features/items/itemsHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import CleanupHandler from '../../features/messages/cleanupHandler';
import ElectionHelper from '../../features/hierarchy/election/electionHelper';
import AboutHelper from '../../features/server/aboutHelper';
import LinkPreviewFilter from '../../features/messages/linkPreviewFilter';
import InstantFurnaceMinigame from '../../features/minigame/small/instantfurnace';
import UsableItemHelper from '../../features/items/usableItemHelper';
import STATE from '../../../core/state';
import EasterMinigame from '../../features/minigame/holidays/easter';


export default async function reactAddedHandler(reaction, user) {
    const isUser = !UsersHelper.isCooper(user.id);

    try {      
        // Approve/promote/sacrifice reaction (vote) handlers.
        SacrificeHelper.onReaction(reaction, user);
        RedemptionHelper.onReaction(reaction, user);
        ElectionHelper.onReaction(reaction, user);

        // User settings via about channel
        AboutHelper.onReaction(reaction, user);

        // Check for usable items being exercised.
        UsableItemHelper.onReaction(reaction, user);

        // Reaction based minigame react processors.
        EggHuntMinigame.onReaction(reaction, user);
        CratedropMinigame.onReaction(reaction, user);
        MiningMinigame.onReaction(reaction, user);
        WoodcuttingMinigame.onReaction(reaction, user);
        InstantFurnaceMinigame.onReaction(reaction, user);
        EasterMinigame.onReaction(reaction, user);


        // Allow elected people to cleanup Cooper messages.
        CleanupHandler.onReaction(reaction, user);

        // Prevent and toggle link previews.
        LinkPreviewFilter.onReaction(reaction, user);

        // Random point spawn.
        if (reaction.emoji.name === 'coop' && isUser) {
            if (STATE.CHANCE.bool({ likelihood: 1 })) {
                setTimeout(() => ItemsHelper.drop(reaction.message, 'COOP_POINT'), 2222);
            }
        }

    } catch(e) {
        console.error(e);
    }
}