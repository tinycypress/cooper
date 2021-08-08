import { Router } from "express";

const BlogRouter = Router();

BlogRouter.get('/', (req, res) => {
    res.status(200).json({ 
        posts: []
    });
});

BlogRouter.get('/:slug', (req, res) => {
    res.status(200).json({ 
        posts: []
    });
});

BlogRouter.post('/publish', (req, res) => {
    res.status(200).json({ development: true });
});

export default BlogRouter;
