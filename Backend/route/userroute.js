import { Router } from 'express'
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgotpassword',forgotPasswordController)
userRouter.put('/verify-forgot-pass-otp',verifyForgotPasswordOtp)
userRouter.put('/resetpass',resetpassword)
userRouter.post('/refreshtoken',refreshToken)
userRouter.get('/user-details',auth,userDetails)
export default userRouter