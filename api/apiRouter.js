import { Router } from "express";
import AuthRouter from "./auth/authRouter";
import BasesRouter from "./services/bases/basesRouter";

const APIRouter = Router();

APIRouter.get('/', (req, res) => res.status(200).send(200));
APIRouter.use('/auth', AuthRouter);
APIRouter.use('/bases', BasesRouter);

export default APIRouter;

