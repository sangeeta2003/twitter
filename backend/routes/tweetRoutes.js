import express from 'express'

import {
  createTweet,
  deleteTweet,
  likeOrDislike
} from '../controllers/tweetControler.js'
import isAuthenticated from '../config/auth.js'
import {
  bookmark,
  getMyProfile,
  getOtherUser
} from '../controllers/userController.js'
const router = express.Router()

router.route('/create').post(isAuthenticated, createTweet)
router.route('/delete/:id').delete(deleteTweet)
router.route('/like/:id').put(isAuthenticated, likeOrDislike)

export default router
