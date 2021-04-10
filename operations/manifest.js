import SacrificeHelper from "./members/redemption/sacrificeHelper";
import SuggestionsHelper from "./activity/suggestions/suggestionsHelper";
import EventsHelper from "./eventsHelper";
import EconomyNotifications from "./activity/information/economyNotifications";
import MessageNotifications from "./activity/information/messageNotifications";

import CratedropMinigame from "./minigames/small/cratedrop";
import EggHuntMinigame from "./minigames/small/egghunt";
import MiningMinigame from "./minigames/small/mining";
import WoodcuttingMinigame from "./minigames/small/woodcutting";
import InstantFurnaceMinigame from "./minigames/small/instantfurnace";
import EasterMinigame from "./minigames/small/holidays/easter";
import BuffsHelper from "./minigames/medium/conquest/buffsHelper";
import ChestPopMinigame from "./minigames/small/chestpop";

import CooperMorality from "./minigames/small/cooperMorality";
import TradingHelper from "./minigames/medium/economy/items/tradingHelper";
import EconomyHelper from "./minigames/medium/economy/economyHelper";
import ElectionHelper from "./members/hierarchy/election/electionHelper";
import AboutHelper from "./marketing/about/aboutHelper";


import COOP from "../origin/coop";



export const baseTickDur = 60 * 25 * 1000;


// Events manifest should load baseTickDuration from COOP.STATE (which loads from database of community set values)
export default function eventsManifest() {

  // Check member of the week historical_points, see if needed... like election style
  EventsHelper.runInterval(() => COOP.POINTS.updateMOTW(), baseTickDur * 5);

  // Server related house keeping items.
  EventsHelper.runInterval(() => AboutHelper.addAboutStats(), baseTickDur * 3.5);

  // Clean up user data, may have missed detection on a leave/kick/ban.
  EventsHelper.runInterval(() => COOP.USERS.cleanupUsers(), baseTickDur * 6);

  // Ensure all users registered in memory for functionality.
  // I turned this off because it seems like it is never necessary, we do not allow guests games.
  EventsHelper.runInterval(() => COOP.USERS.populateUsers(), baseTickDur * 4);

  // Clean up temporary messages around every... quick lol.

  // New day events/calendar events.
  EventsHelper.runInterval(() => COOP.CHICKEN.checkIfNewDay(), baseTickDur / 2);

  // Election related
  ElectionHelper.setupIntervals();
  
  // Above is unfinished
  EventsHelper.runInterval(() => SuggestionsHelper.check(), baseTickDur * 4);
  EventsHelper.runInterval(() => MessageNotifications.process(), baseTickDur * 2);
  EventsHelper.runInterval(() => EconomyNotifications.post(), baseTickDur * 1.75);

  // Sacrifice, moderation related.
  EventsHelper.runInterval(() => SacrificeHelper.random(), baseTickDur * 12);
  EventsHelper.runInterval(() => SacrificeHelper.updateSacrificeHeaderMessage(), baseTickDur * 6);

  // Update trades channel message
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 2);

  // TODO: Incomplete.
  EventsHelper.chanceRunInterval(() => EconomyHelper.circulation(), 45, baseTickDur * 4);

  // Minigame related items.
  
  // TODO: Needs a lot more effort.
  EventsHelper.runInterval(() => CooperMorality.evaluate(), baseTickDur * 4.5);


  // Update person with most points role.
  EventsHelper.runInterval(() => COOP.POINTS.updateCurrentWinner(), baseTickDur * 3);

  // Update person with richest role.
  EventsHelper.runInterval(() => COOP.ITEMS.updateRichest(), baseTickDur * 5);

  // Update person in the community economy with MOST_ITEMS and give role/reward.
  EventsHelper.runInterval(() => COOP.ITEMS.updateMostItems(), baseTickDur * 3);



  // Events dependent upon server tick and community velocity rate adjusted.
  EventsHelper.chanceRunInterval(() => WoodcuttingMinigame.run(), 55, baseTickDur * 5);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 45, baseTickDur * 6);
  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur * 5);
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 2.5, baseTickDur / 10);
  EventsHelper.chanceRunInterval(() => InstantFurnaceMinigame.run(), 45, baseTickDur * 7.5);

  // Bring in the new minigame.
  EventsHelper.runInterval(() => ChestPopMinigame.dev(), (baseTickDur * 2) * 9);

  // If easter, double egg spawns too.
  
  // Holiday related!
  EventsHelper.chanceRunInterval(() => EasterMinigame.run(), 33, baseTickDur / 3);



  // Update trades channel message
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 2);

  // Clean up CONQUEST buffs/item effects.
  EventsHelper.runInterval(() => BuffsHelper.cleanupExpired(), baseTickDur / 3);

  // TODO: Update and create most items role
 


  // TODO: Add a !bang very, very, rarely.



  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    COOP.CHANNELS._postToFeed('Ruuuuuu' + 'u'.repeat(COOP.STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 10);

  EventsHelper.chanceRunInterval(() => { COOP.CHANNELS._postToFeed('._.') }, 7, baseTickDur * 3.5);
}
