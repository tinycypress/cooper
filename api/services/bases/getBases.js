import BaseHelper from "../../../operations/minigames/medium/conquest/baseHelper";

export default function getBases(req, res) {
    const bases = await BaseHelper.all();
    return res.status(200).json(bases);
}
  
  