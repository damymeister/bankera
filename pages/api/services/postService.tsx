import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function createPost(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { post_title, post_content, user_id } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        post_title,
        post_content,
        posted_on: new Date(),
        user: { connect: { user_id: 1 } }, // Connect the post to the specified user
      },
    });

    console.log("New post created:", newPost);

    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
