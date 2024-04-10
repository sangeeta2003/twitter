import { Tweet } from "../models/tweetSchema.js";
import { User } from '../models/userSchema.js';

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

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(401).json({
      message: "Tweet deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const likeOrDislike = async (req, res) => {
  try {
    const { token } = req.cookies;
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const loggedInId = data.userId;
    const tweetId = req.params.id;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.like.includes(loggedInId)) {
      // Dislike
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInId } });
      return res.status(200).json({ message: "User disliked the tweet" });
    } else {
      // Like
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInId } });
      return res.status(200).json({ message: "User liked the tweet" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getAlltweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedinUser = await User.findById(id);

    
    if (!loggedinUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const loggedinUserTweets = await Tweet.find({ userId: id });

    
    if (!loggedinUser.following) {
      return res.status(200).json({ tweets: loggedinUserTweets });
    }

    const followingUserTweets = await Promise.all(
      loggedinUser.following.map((otherUserId) => {
        return Tweet.find({ userId: otherUserId });
      })
    );

    return res.status(200).json({
      tweets: loggedinUserTweets.concat(...followingUserTweets),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFollowingtweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedinUser = await User.findById(id);

    
    

    const followingUserTweets = await Promise.all(
      loggedinUser.following.map((otherUserId) => {
        return Tweet.find({ userId: otherUserId });
      })
    );

    return res.status(200).json({
      tweets:[].concat(...followingUserTweets),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

