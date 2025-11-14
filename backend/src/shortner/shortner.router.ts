import { Router } from 'express';
import { createShortUrl, getAllShortLinksByUser } from './shortner.controller';

const router = Router();

router.post('/shortner', createShortUrl);
router.get('/shortner', getAllShortLinksByUser);

export default router;
