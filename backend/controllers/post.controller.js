import ImageKit from "imagekit";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"

export const getPost = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).populate("user", "username img");
    res.status(200).json(post);
}

export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const query = {}

        const cat = req.query.cat
        const author = req.query.author
        const searchQuery = req.query.search
        const sortQuery = req.query.sort
        const featured = req.query.featured

        if (cat) {
            query.category = { $regex: new RegExp(`^${cat}$`, 'i') }
        }

        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: "i" }
        }

        if (author) {
            const user = await User.findOne({ username: author }).select("_id");
            if (!user) {
                return res.status(404).json({ message: "Author not found!" });
            }
            query.user = user._id;
        }

        if (featured) {
            query.isFeatured = true;
        }

        let sortObj = { createdAt: -1 };

        if (sortQuery) {
            switch (sortQuery) {
                case "newest":
                    sortObj = { createdAt: -1 };
                    break;
                case "oldest":
                    sortObj = { createdAt: 1 };
                    break;
                case "popular":
                    sortObj = { visit: -1, _id: 1 };
                    break;
                case "trending":
                    sortObj = { visit: -1, _id: 1 };
                    query.createdAt = {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    };
                    break;
                default:
                    break;
            }
        }

        const posts = await Post.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .populate("user", "username img")
            .lean();

        const total = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            hasMore: page * limit < total,
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const createPost = async (req, res) => {
    console.log(req.body);
    const { userId } = await req.auth();

    if (!userId) {
        return res.status(401).json('Not Authenticated!');
    }

    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
        return res.status(404).json('User not found!');
    }

    let baseSlug = req.body.title.trim().replace(/ /g, "-").toLowerCase();
    let slug = baseSlug;
    let counter = 1;

    while (await Post.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    const newPost = new Post({ user: user._id, slug, ...req.body });

    const post = await newPost.save();
    res.status(201).json({ message: "Post Created Successfully!", post });
};

export const deletePost = async (req, res) => {
    const { userId } = await req.auth();

    if (!userId) {
        return res.status(401).json('Not Authenticated!');
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user"

    if (role === "admin") {
        const deletedPost = await Post.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json({ message: "Post Deleted Successfully!", deletedPost });

    }

    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
        return res.status(404).json('User not found!');
    }

    const deletedPost = await Post.findOneAndDelete({
        _id: req.params.id,
        user: user._id,
    });

    if (!deletedPost) {
        return res.status(404).json({ message: "Post not Found" });
    }

    res.status(200).json({ message: "Post Deleted Successfully!", deletedPost });
};

export const featurePost = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role !== "admin") {
        return res.status(403).json("You cannot feature posts!");
    }

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json("Post not found!");
    }

    const isFeatured = post.isFeatured;

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            isFeatured: !isFeatured,
        },
        { new: true }
    );

    res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
})

export const uploadAuth = async (req, res) => {
    const { token, expire, signature } = imagekit.getAuthenticationParameters();
    res.send({ token, expire, signature, publicKey: process.env.IK_PUBLIC_KEY });
}


