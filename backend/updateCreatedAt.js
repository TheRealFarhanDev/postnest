import mongoose from "mongoose";
import Post from "./models/post.model.js"

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    const ids = [
      "683b25afd962f209c9689001",
      "683b25afd962f209c9689004",
      "683b25afd962f209c9689002"
    ];

    // Delete old documents
    await Post.deleteMany({
      _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
    });
    console.log("🗑️ Deleted old posts");

    // Insert fresh documents with correct createdAt
    await Post.insertMany([
      {
        _id: new mongoose.Types.ObjectId("683b25afd962f209c9689001"),
        user: "683b25afd962f209c9687672",
        title: "Minimalist Web Design: The Power of Simplicity",
        slug: "minimalist-web-design-2025",
        category: "Web-Design",
        img: "https://images.pexels.com/photos/1181479/pexels-photo-1181479.jpeg",
        desc: "Explore how minimalist UI and whitespace-dominant layouts are redefining design.",
        content: "<img src='https://images.pexels.com/photos/1181479/pexels-photo-1181479.jpeg'>",
        isFeatured: true,
        visit: 0,
        createdAt: new Date("2025-06-20T09:00:00.000Z"),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId("683b25afd962f209c9689004"),
        user: "683b25afd962f209c9687672",
        title: "Next-Level Development: AI Coding Assistants & DevOps Fusion",
        slug: "ai-devops-future-development-2025",
        category: "Development",
        img: "https://images.pexels.com/photos/1181268/pexels-photo-1181268.jpeg",
        desc: "Discover how AI-powered code tools and seamless DevOps workflows are transforming development.",
        content: "<img src='https://images.pexels.com/photos/1181268/pexels-photo-1181268.jpeg'>",
        isFeatured: true,
        visit: 0,
        createdAt: new Date("2025-06-20T09:45:00.000Z"),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId("683b25afd962f209c9689002"),
        user: "683b25afd962f209c9687672",
        title: "NoSQL vs SQL: Choosing the Right Database for Modern Apps",
        slug: "nosql-vs-sql-database-2025",
        category: "Databases",
        img: "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg",
        desc: "Confused between SQL and NoSQL? Learn which database is ideal for your app.",
        content: "<img src='https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg'>",
        isFeatured: true,
        visit: 0,
        createdAt: new Date("2025-06-20T09:15:00.000Z"),
        updatedAt: new Date()
      }
    ]);

    console.log("✅ Reinserted posts with correct createdAt");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

run();
