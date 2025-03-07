// NO SE USA
// ESTAS RUTAS LAS REDIRIGE API GATEWAY HACIA LAMBDA AUTH SERVICE

import { Router } from 'express';
import * as Auth from '../controllers/authenticationController.js';

const router = Router();


router.post('/signup', Auth.signup); 
router.post('/login', Auth.login); 


export default router;