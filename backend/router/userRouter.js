import express from 'express';
import { changePassword, deleteUser, getAllUsers, getCurrentUser, googleLogin, loginUser, saveUser, sendOTP, updateUser } from '../controller/usercontrolle.js';
import { get } from 'mongoose';

// Create a new router for user-related routes
const userRouter = express.Router();

// Define the route for saving a user
userRouter.post('/',saveUser)

// Define the route for logging in a user
userRouter.post('/login', loginUser)

//google login
userRouter.post('/google', googleLogin)

userRouter.get('/current', getCurrentUser);

userRouter.post('/sendMail', sendOTP);

userRouter.post('/changepw', changePassword);

userRouter.delete('/:userID', deleteUser)

userRouter.put('/:userID', updateUser);

userRouter.get('/', getAllUsers)
export default userRouter;