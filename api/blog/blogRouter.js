import { Router } from "express";
import BlogHelper from "../../operations/marketing/blog/blogHelper";

const BlogRouter = Router();

BlogRouter.get('/', async (req, res) => {
    const posts = await BlogHelper.loadHeadlines();
    res.status(200).json({ posts });
});

BlogRouter.get('/:slug', (req, res) => {
    const post = await BlogHelper.loadPostBySlug(req.params.slug);
    res.status(200).json(post);
});

export default BlogRouter;
