import express from 'express'
import {
  Register,
  Login,
  logout,
  bookmark,
  getMyProfile,
  getOtherUser,
  follow
} from '../controllers/userController.js'
import isAuthenticated from '../config/auth.js'

const router = express.Router()

router.route('/register').post(Register)
router.route('/login').post(Login)
router.route('/logout').get(logout)
router.route('/bookmark/:id').put(isAuthenticated, bookmark)
router.route('/profile/:id').get(isAuthenticated, getMyProfile)
router.route('/otheruser/:id').get(isAuthenticated, getOtherUser)
router.route('/follow/:id').post(isAuthenticated, follow)
export default router
