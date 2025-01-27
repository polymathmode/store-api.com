import express from 'express'
import { createUserHandler, loginHandler } from '../controllers/authController'

const router = express.Router();

router.post('/register', createUserHandler  );
 router.post('/login', loginHandler);

export default router;