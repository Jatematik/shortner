import { Router } from 'express';
import {
  createShortUrl,
  getAllShortLinksByUser,
  removeShortLink,
  updateShortLink,
} from './shortner.controller';

const router = Router();

router.post('/shortner', createShortUrl);
router.get('/shortner', getAllShortLinksByUser);
router.patch('/shortner/:id', updateShortLink);
router.delete('/shortner/:id', removeShortLink);

export default router;
