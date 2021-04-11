import { CHANNELS } from "../../../origin/coop";
import { baseTickDur } from "../../manifest";

export default class ChestPopMinigame {

    static INTERVAL = (baseTickDur * 2) * 9;

    static run() {
        CHANNELS._postToFeed('ChestPop? 💰');
    }
    
}