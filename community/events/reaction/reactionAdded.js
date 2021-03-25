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


export default async function reactAddedHandler(reaction, user) {
    const isUser = !UsersHelper.isCooper(user.id);

    try {      
        // Check for usable items being exercised.
        ItemsHelper.onReaction(reaction, user);

        // Reaction based minigame react processors.
        EggHuntMinigame.onReaction(reaction, user);
        CratedropMinigame.onReaction(reaction, user);
        MiningMinigame.onReaction(reaction, user);
        WoodcuttingMinigame.onReaction(reaction, user);
        InstantFurnaceMinigame.onReaction(reaction, user);

        // Check for reaction on intro message.
        RedemptionHelper.onReaction(reaction, user);

        // Check for reaction on sacrifice message.
        SacrificeHelper.onReaction(reaction, user);

        // Check if reaction is an election vote.
        ElectionHelper.onReaction(reaction, user);

        // Allow elected people to cleanup Cooper messages.
        CleanupHandler.onReaction(reaction, user);

        // Settings via about channel
        AboutHelper.onReaction(reaction, user);

        // Prevent and toggle link previews.
        LinkPreviewFilter.onReaction(reaction, user);

        // If coop emoji ever added, double down on it... just because.
        if (reaction.emoji.name === 'coop' && isUser) reaction.message.react(EMOJIS.COOP);
        if (reaction.emoji.name === '🤦‍♂️' && isUser) reaction.message.react('🤦‍♂️');

        // Events which are unconcerned with if the reactor is Cooper:
        if (UsersHelper.isCooper(user.id)) return false;

        // Functions called here completely ignore Cooper, should be all bots.

    } catch(e) {
        console.error(e);
    }
}