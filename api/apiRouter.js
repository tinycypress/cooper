import { Router } from "express";

import AuthRouter from "./auth/authRouter";
import BlogRouter from "./services/blog/blogRouter";
import BasesRouter from "./services/bases/basesRouter";
import GroundRouter from "./services/conquest/groundRouter";
import MembersRouter from "./services/members/membersRouter";
import ProjectsRouter from "./services/projects/projectsRouter";
import EconomyRouter from "./services/economy/economyRouter";

const APIRouter = Router();

APIRouter.get('/', (req, res) => res.status(200).send(200));
APIRouter.use('/auth', AuthRouter);

APIRouter.use('/members', MembersRouter);
APIRouter.use('/blog', BlogRouter);

APIRouter.use('/bases', BasesRouter);
APIRouter.use('/ground', GroundRouter);

APIRouter.get('/projects', ProjectsRouter);

APIRouter.get('/economy', EconomyRouter);

export default APIRouter;
