import { Router } from 'express';
import {
  getQuestion,
  getOneFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controller/question.controller.js';

const router = Router();

router.route('/').get(getQuestion).post(createFAQ);

router.route('/:id').get(getOneFAQ).put(updateFAQ).delete(deleteFAQ);

export default router;
