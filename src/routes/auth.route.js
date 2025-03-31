import express from 'express';
import { signin, signout, signup, updateProfilePic, checkAuth } from '../controllers/auth.controllers.js';
import { protectedRoute } from '../middleware/auth.middleware.js';


const router  = express.Router()


router.post('/signup', signup)

router.post('/signin', signin)

router.post('/signout', signout)

router.put('/update-profile-pic', protectedRoute, updateProfilePic)

router.get('/check', protectedRoute, checkAuth)

export default router;