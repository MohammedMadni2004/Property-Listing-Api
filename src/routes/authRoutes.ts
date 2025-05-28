import express from 'express';
import {signupController, loginController} from '../controllers/authController';
import validateRequest from '../middleware/validateRequest';

const router = express.Router();

router.post('/signup', validateRequest, signupController);
router.post('/login', validateRequest, loginController);

export default router;
