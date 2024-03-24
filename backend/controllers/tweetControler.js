import { Tweet } from "../models/tweetSchema.js";

export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      res.status(401).json({
        message: "Fileds are required!",
        success: false,
      });
    }
    await Tweet.create({
      description,
      userId: id,
    });
    return res.status(201).json({
      message: "Tweet created successfully",
      success: true,
    });
  } catch {}
};
