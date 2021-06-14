import { Router } from "express";

const APIRouter = Router();

APIRouter.get('/', (req, res) => res.send('Hello World!'));
APIRouter.use('/auth', AuthRouter);
APIRouter.use('/bases', BasesRouter);

export default APIRouter;

