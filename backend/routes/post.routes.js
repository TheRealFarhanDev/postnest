import express from 'express'
import { getPosts, getPost, createPost, deletePost, featurePost, uploadAuth } from '../controllers/post.controller.js';
import increaseVisit from '../middlewares/increaseVisit.middleware.js';

const router = express.Router();

router.get("/upload-auth", uploadAuth)

router.get("/", getPosts)
router.get("/:slug",increaseVisit, getPost)
router.post("/", createPost)
router.delete("/:id", deletePost)
router.patch("/feature", featurePost)



export default router