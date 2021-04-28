import SacrificeHelper from "./members/redemption/sacrificeHelper";
import SuggestionsHelper from "./activity/suggestions/suggestionsHelper";
import EventsHelper from "./eventsHelper";
import EconomyNotifications from "./activity/information/economyNotifications";
import MessageNotifications from "./activity/information/messageNotifications";

import CrateDrop from "./minigames/small/cratedrop";
import EggHunt from "./minigames/small/egghunt";
import Mining from "./minigames/small/mining";
import Woodcutting from "./minigames/small/woodcutting";
import InstantFurnace from "./minigames/small/instantfurnace";
import EasterMinigame from "./minigames/small/holidays/easter";
import ChestPop from "./minigames/small/chestpop";

import BuffsHelper from "./minigames/medium/conquest/buffsHelper";
import CooperMorality from "./minigames/small/cooperMorality";
import TradingHelper from "./minigames/medium/economy/items/tradingHelper";
import EconomyHelper from "./minigames/medium/economy/economyHelper";
import ElectionHelper from "./members/hierarchy/election/electionHelper";
import AboutHelper from "./marketing/about/aboutHelper";


import COOP, { SERVER } from "../origin/coop";
import TodoHelper from "./productivity/todos/todoHelper";
import { status } from "./marketing/rewards/loyalty";
import ProspectHelper from "./members/redemption/prospectHelper";

export const baseTickDur = 60 * 25 * 1000;

// Interval basis for checking events that depend on community velocity value.
export const VELOCITY_EVENTS = {
  CHESTPOP: { 
    since: 0, 
    handler: () => ChestPop.run(), 
    interval: (baseTickDur * 2) * 9 
  },
  INSTANT_FURNACE: { 
    since: 0, 
    handler: () => InstantFurnace.run(), 
    interval: baseTickDur * 7.5 
  },
  MINING: { 
    since: 0, 
    handler: () => Mining.run(), 
    interval: baseTickDur * 6 
  },
  WOODCUTTING: { 
    since: 0, 
    handler: () => Woodcutting.run(), 
    interval: baseTickDur * 5 
  },
  EGGHUNT: { 
    since: 0, 
    handler: () => EggHunt.run(), 
    interval: baseTickDur / 2
  },
  CRATEDROP: { 
    since: 0, 
    handler: () => CrateDrop.run(), 
    interval: baseTickDur * 5 
  },
};

// Events manifest should load baseTickDuration from COOP.STATE (which loads from database of community set values)
export default function eventsManifest() {

  // Core tick handler for more granularity over timing.
  EventsHelper.runInterval(() => SERVER.tick(), 30000);

  // Check Todo helper items late! PUNISH!
  EventsHelper.runInterval(() => TodoHelper.checkDue(), baseTickDur / 3);

  // New day events/calendar events.
  EventsHelper.runInterval(() => COOP.CHICKEN.checkIfNewDay(), baseTickDur / 2);

  // Check member of the week historical_points, see if needed... like election style
  EventsHelper.runInterval(() => COOP.POINTS.updateMOTW(), baseTickDur * 5);
  EventsHelper.runInterval(() => AboutHelper.addAboutStats(), baseTickDur * 3.5);
  EventsHelper.runInterval(() => MessageNotifications.process(), baseTickDur * 2);
  EventsHelper.runInterval(() => EconomyNotifications.post(), baseTickDur * 1.75);
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 2);


  // Clean up user data, may have missed detection on a leave/kick/ban.
  EventsHelper.runInterval(() => COOP.USERS.cleanupUsers(), baseTickDur * 6);
  // Ensure all users registered in memory for functionality.
  EventsHelper.runInterval(() => COOP.USERS.populateUsers(), baseTickDur * 4);

  // Marketing
  EventsHelper.runInterval(status, baseTickDur * 5.25);


  // Election related
  ElectionHelper.setupIntervals();
  
  // Above is unfinished
  EventsHelper.runInterval(() => SuggestionsHelper.check(), baseTickDur * 4);


  // Sacrifice, moderation related.
  EventsHelper.chanceRunInterval(() => SacrificeHelper.random(), 20, baseTickDur * 12);
  EventsHelper.chanceRunInterval(() => ProspectHelper.randomReady(), 20, baseTickDur * 14);

  // TODO: This does not seem sufficient?
  EventsHelper.runInterval(() => SacrificeHelper.updateSacrificeHeaderMessage(), baseTickDur * 6);


  // TODO:
  // Spam talk with low probability, low lifespan messages:
  // Skill scores, item circulation, leaderboard, tip, latest trades

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
