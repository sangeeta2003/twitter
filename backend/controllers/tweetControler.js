import { Tweet } from '../models/tweetSchema.js'

export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body
    if (!description || !id) {
      res.status(401).json({
        message: 'Fileds are required!',
        success: false
      })
    }
    await Tweet.create({
      description,
      userId: id
    })
    return res.status(201).json({
      message: 'Tweet created successfully',
      success: true
    })
  } catch {}
}

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params
    await Tweet.findByIdAndDelete(id)
    return res.status(401).json({
      message: 'Tweet deleted successfully.',
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}
export const likeOrDislike = async (req, res) => {
  try {
    const { token } = req.cookies
    const data = jwt.verify(token, process.env.TOKEN_SECRET)
    const loggedinUserId = data.userId
    const tweetId = req.params.id

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' })
    }

    if (tweet.like.includes(loggedInId)) {
      // Dislike
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInId } })
      return res.status(200).json({ message: 'User disliked the tweet' })
    } else {
      // Like
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInId } })
      return res.status(200).json({ message: 'User liked the tweet' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
