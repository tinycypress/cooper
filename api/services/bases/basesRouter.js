import { Router } from "express";
import BaseHelper from "../../../operations/minigames/medium/conquest/baseHelper";

const BasesRouter = Router();


export const getBases = async (req, res) => res.status(200).json(await BaseHelper.all());
BasesRouter.get('/', getBases);

export const getBase = async (req, res) => res.status(200).json(await BaseHelper.get(req.params.base));
BasesRouter.get('/:base', getBase);

// :tile keyword should be reserves for all tiles not just tiles with a base on as currently used.
// BasesRouter.get('/:tile', getBase);

export default BasesRouter;

