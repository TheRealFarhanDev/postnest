import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(400).json({ message: "Webhook verification failed!" });
  }

  const eventType = evt.type;
  const userData = evt.data;

  // Handle user creation
  if (eventType === 'user.created') {
    const clerkUserId = userData?.id;
    const username = userData?.username;
    const email = userData?.email_addresses?.[0]?.email_address;
    const img = userData?.image_url;

    // 🚨 Prevent insert with null/undefined clerkUserId
    if (!clerkUserId || !username || !email) {
      console.warn("Missing required user data:", { clerkUserId, username, email });
      return res.status(400).json({ message: "Missing required user fields" });
    }

    try {
      const savedUser = await User.findOneAndUpdate(
        { clerkUserId },
        { clerkUserId, username, email, img },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log("User created or updated:", savedUser);
    } catch (err) {
      console.error("Error upserting user:", err);
      return res.status(500).json({ message: "Failed to upsert user" });
    }
  }


  // Handle user update
  if (eventType === 'user.updated') {
    const clerkUserId = userData.id;
    const username = userData.username;
    const email = userData.email_addresses?.[0]?.email_address;
    const img = userData.image_url;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { clerkUserId },
        { username, email, img },
        { new: true }
      );

      if (updatedUser) {
        console.log("User updated successfully:", updatedUser);
      } else {
        console.warn("User not found for update.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Failed to update user" });
    }
  }

  return res.status(200).json({ message: "Webhook received" });
};
