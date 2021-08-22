import { Router } from "express";
import BlogHelper from "../../../operations/marketing/blog/blogHelper";
import SubscriptionHelper from "../../../operations/marketing/newsletter/subscriptionHelper";

const BlogRouter = Router();

BlogRouter.get('/', async (req, res) => {
    const posts = await BlogHelper.loadHeadlines();
    res.status(200).json(posts);
});

BlogRouter.get('/:slug', async (req, res) => {
    const post = await BlogHelper.loadPostBySlug(req.params.slug);
    res.status(200).json(post);
});


BlogRouter.post('/subscribe', async (req, res) => {
    const result = {
        success: false
    };

    try {
        console.log('Subscribe!');
        console.log(req);

        // const existing = await SubscriptionHelper.getByEmail(req.body.email);
        // if (existing) throw new Error('Email subscription already exists.');

        // const didCreate = await SubscriptionHelper.create(email, null, 1);
        // if (didCreate) result.success = true;

    } catch(e) {
        console.log('Error subscribing via website.');
        console.error(e);
    }

    return res.status(200).json({
        testing: true,
        result
    });
});


BlogRouter.post('/unsubscribe', async (req, res) => {
    const result = {
        success: false
    };

    console.log('Unsubscribe!');
    console.log(req);

    try {
        // const existing = await SubscriptionHelper.getByEmail(req.body.email);
    
        // if (!existing) throw new Error('Not a valid subscription.');

        // const didCreate = await SubscriptionHelper.create(email, null, 1);
        // if (didCreate) result.success = true;

    } catch(e) {
        console.log('Error subscribing via website.');
        console.error(e);
    }

    return res.status(200).json({
        testing: true,
        result
    });
});

export default BlogRouter;