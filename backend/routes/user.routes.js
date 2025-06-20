import express from 'express'
import { getSavedPosts, savePosts } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/saved", getSavedPosts)
router.patch("/save", savePosts)

export default router