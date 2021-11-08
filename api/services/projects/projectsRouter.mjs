import { Router } from "express";
import ProjectsHelper from "../../../operations/productivity/projects/projectsHelper.mjs";

const ProjectsRouter = Router();

ProjectsRouter.get('/', async (req, res) => {
    const projects = await ProjectsHelper.all();
    res.status(200).json(projects);
});

// TODO: Projects need slug =0
ProjectsRouter.get('/:projectSlug', async (req, res) => {
    const projects = await ProjectsHelper.loadBySlug(req.params.slug);
    res.status(200).json(projects);
});

export default ProjectsRouter;
