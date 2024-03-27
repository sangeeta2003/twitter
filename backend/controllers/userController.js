import { User } from '../models/userSchema.js'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config({
  path: '../controllers/.env'
})
export const Register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        msg: 'All fields are required',
        success: false
      })
    }
    const user = await User.findOne({ email })
    if (user) {
      return res.status(401).json({
        message: 'User already exist',
        success: false
      })
    }
    const hashpassword = await bcryptjs.hash(password, 16)

    await User.create({
      name,
      username,
      email,
      password: hashpassword
    })
    return res.status(201).json({
      message: 'account created successfully',
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).json({
        message: 'All fields are required',
        success: false
      })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: "user doesn't exist with this email",
        success: false
      })
    }

    const isMatch = await bcryptjs.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Incorrect email or password',
        success: false
      })
    }

    const tokenData = {
      userId: user._id
    }
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET)
    return res
      .status(200)
      .cookie('token', token, { expiresIn: '1d', httpOnly: true })
      .json({
        message: `welcome back ${user.name}`,
        success: true
      })
  } catch (error) {
    console.log(error)
  }
}

export const logout = (req, res) => {
  return res.cookie('token', '', { expiresIn: new Date(Date.now()) }).json({
    message: 'user logged out succcessfully',
    success: true
  })
}

export const bookmark = async (req, res) => {
  try {
    const { token } = req.cookies
    const data = jwt.verify(token, process.env.TOKEN_SECRET)
    const loggedInId = data.userId
    const tweetId = req.params.id

    const user = await User.findById(loggedInId)
    if (user.bookmarks.includes(tweetId)) {
      await User.findByIdAndUpdate(loggedInId, {
        $pull: { bookmarks: tweetId }
      })
      return res.status(200).json({ message: 'Removed from bookmarks' })
      // remove
    } else {
      await User.findByIdAndUpdate(loggedInId, {
        $push: { bookmarks: tweetId }
      })
      return res.status(200).json({ message: 'Saved in bookmarks' })
      // remove
    }
  } catch (error) {
    console.log(error)
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id).select('-password')
    return res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
  }
}

export const getOtherUser = async (req, res) => {
  try {
    const { id } = req.params
    const otherUsers = await User.find({ _id: { $ne: id } }).select('-password')
    if (!otherUsers) {
      return res.status(401).json({
        message: "currently don't have any user"
      })
    }
    return res.status(200).json({
      otherUsers
    })
  } catch {
    error
  }
  console.log(error)
}

export const follow = async (req, res) => {
  try {
    const { token } = req.cookies
    const data = jwt.verify(token, process.env.TOKEN_SECRET)
    const loggedinUserId = data.userId
    const userId = req.params.id
    const loggedinUser = await User.findById(loggedinUserId)

    const user = await User.findById(userId)
    if (!user.followers.includes(loggedinUserId)) {
      await User.findByIdAndUpdate(userId, {
        $push: { followers: loggedinUserId }
      })
      await User.findByIdAndUpdate(loggedinUserId, {
        $push: { following: userId }
      })
    } else {
      return res.status(400).json({
        message: `User already followed to ${user.name}`
      })
    }
    return res.status(200).json({
      message: `${loggedinUser.name} justo follow to ${user.name}`,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}
