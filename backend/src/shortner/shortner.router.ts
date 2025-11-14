import { Router } from 'express';
import { createShortUrl } from './shortner.controller';

const router = Router();

router.post('/shortner', createShortUrl);

export default router;
