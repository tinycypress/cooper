import ChannelHelper from "../../core/entities/channels/channelsHelper";

import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import EventsHelper from "../features/events/eventsHelper";


import MessageNotifications from "./message/messageNotifications";
import EconomyNotifications from "../features/minigame/economyNotifications";

import STATE from "../../core/state";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import MiningMinigame from "../features/minigame/small/mining";
import WoodcuttingMinigame from "../features/minigame/small/woodcutting";
import Chicken from "../chicken";
import CooperMorality from "../features/minigame/small/cooperMorality";
import TradingHelper from "../features/items/tradingHelper";
import EconomyHelper from "../features/economy/economyHelper";
import ElectionHelper from "../features/hierarchy/election/electionHelper";
import UsersHelper from "../../core/entities/users/usersHelper";
import ServerHelper from "../../core/entities/server/serverHelper";
import InstantFurnaceMinigame from "../features/minigame/small/instantfurnace";
import ItemsHelper from "../features/items/itemsHelper";
import ChestPopMinigame from "../features/minigame/small/chestpop";
import BuffsHelper from "../features/conquest/buffsHelper";
import AboutHelper from "../features/server/aboutHelper";
import EasterMinigame from "../features/minigame/holidays/easter";


export const baseTickDur = 60 * 25 * 1000;


// Events manifest should load baseTickDuration from STATE (which loads from database of community set values)
export default function eventsManifest() {

  // Bring in the new minigame.
  EventsHelper.runInterval(() => ChestPopMinigame.dev(), (baseTickDur * 2) * 9);

  // Check member of the week historical_points, see if needed... like election style
  EventsHelper.runInterval(() => PointsHelper.updateMOTW(), baseTickDur * 5);

  // Server related house keeping items.
  EventsHelper.runInterval(() => AboutHelper.addAboutStats(), baseTickDur * 3.5);

  // Clean up user data, may have missed detection on a leave/kick/ban.
  EventsHelper.runInterval(() => UsersHelper.cleanupUsers(), baseTickDur * 6);

  // Ensure all users registered in memory for functionality.
  // I turned this off because it seems like it is never necessary, we do not allow guests games.
  EventsHelper.runInterval(() => UsersHelper.populateUsers(), baseTickDur * 4);

  // Clean up temporary messages around every... quick lol.
  EventsHelper.runInterval(() => ServerHelper.processTempMessages(), baseTickDur / 10);

  // New day events/calendar events.
  EventsHelper.runInterval(() => Chicken.checkIfNewDay(), baseTickDur / 2);

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
  EventsHelper.runInterval(() => PointsHelper.updateCurrentWinner(), baseTickDur * 3);

  // Update person with richest role.
  EventsHelper.runInterval(() => ItemsHelper.updateRichest(), baseTickDur * 5);

  // Update person in the community economy with MOST_ITEMS and give role/reward.
  EventsHelper.runInterval(() => ItemsHelper.updateMostItems(), baseTickDur * 3);



  EventsHelper.chanceRunInterval(() => WoodcuttingMinigame.run(), 55, baseTickDur * 5);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 45, baseTickDur * 6);
  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur * 5);
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 2.5, baseTickDur / 10);
  EventsHelper.chanceRunInterval(() => InstantFurnaceMinigame.run(), 45, baseTickDur * 7.5);

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
    ChannelHelper._postToFeed('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 10);

  EventsHelper.chanceRunInterval(() => { ChannelHelper._postToFeed('._.') }, 7, baseTickDur * 3.5);
}
