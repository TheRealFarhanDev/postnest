import User from "../models/user.model.js"

export const getSavedPosts = async (req, res) => {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
        return res.status(401).json("Not Authenticated!")
    }

    const user = await User.findOne({ clerkUserId })

    res.status(200).json(user.savedPosts)
}

export const savePosts = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
        return res.status(401).json("Not Authenticated!")
    }

    const user = await User.findOne({ clerkUserId })

    const isSaved = user.savedPosts.some(p => p === postId)

    if (!isSaved) {
        await User.findByIdAndUpdate(user._id, {
            $push: { savedPosts: postId }
        })
    } else {
        await User.findByIdAndUpdate(user._id, {
            $pull: { savedPosts: postId }
        })
    }

    res.status(200).json(isSaved ? "Post Unsaved" : "Post Saved")
}