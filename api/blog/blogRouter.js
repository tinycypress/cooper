import { Router } from "express";
import BlogHelper from "../../operations/marketing/blog/blogHelper";

const BlogRouter = Router();

BlogRouter.get('/', async (req, res) => 
    res.status(200).json({ posts: await BlogHelper.loadHeadlines() })
);

BlogRouter.get('/:slug', (req, res) =>
    res.status(200).json(await BlogHelper.loadPostBySlug(req.params.slug))
);

export default BlogRouter;
