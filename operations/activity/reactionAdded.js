import EggHuntMinigame from "../minigames/small/egghunt";
import CratedropMinigame from "../minigames/small/cratedrop";

import MiningMinigame from "../minigames/small/mining";
import WoodcuttingMinigame from '../minigames/small/woodcutting';
import InstantFurnaceMinigame from '../minigames/small/instantfurnace';
import EasterMinigame from "../minigames/small/holidays/easter";


import RedemptionHelper from "../members/redemption/redemptionHelper";
import SacrificeHelper from "../members/redemption/sacrificeHelper";
import AboutHelper from "../marketing/about/aboutHelper";
import ElectionHelper from "../members/hierarchy/election/electionHelper";

import CleanupHandler from "./messages/cleanupHandler";
import LinkPreviewFilter from './messages/linkPreviewFilter';

import COOP, { USABLE, STATE } from "../../origin/coop";
import { EMOJIS } from "../../origin/config";



export default async function reactAddedHandler(reaction, user) {
    const isUser = !COOP.USERS.isCooper(user.id);

    try {      
        // Approve/promote/sacrifice reaction (vote) handlers.
        SacrificeHelper.onReaction(reaction, user);
        RedemptionHelper.onReaction(reaction, user);
        ElectionHelper.onReaction(reaction, user);

        // User settings via about channel
        AboutHelper.onReaction(reaction, user);

        // Check for usable items being exercised.
        USABLE.onReaction(reaction, user);

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
                setTimeout(() => COOP.ITEMS.drop(reaction.message, 'COOP_POINT'), 2222);
            }
        }

    } catch(e) {
        console.error(e);
    }
}