import asyncHandler from '../utils/AsyncHandler.js'
import { APIResponse } from '../utils/ApiResponse.js';
import { APIError } from '../utils/ApiError.js';
import { FAQ } from '../model/faq.model.js';
import { languages } from '../utils/languages.js';

const getQuestion = asyncHandler(async (req, res) => {
  const lang =
    req.query.lang && languages.includes(req.query.lang)
      ? req.query.lang
      : 'en';

  let faqs = await FAQ.find();

  faqs = faqs.map((faq) => {
    const translation =
      lang !== 'en'
        ? faq.getTranslation(lang)
        : { question: faq.question, answer: faq.answer };
    return { id: faq._id, ...translation };
  });

  return res.status(200).json(new APIResponse(200, faqs, ''));
});

const getOneFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';

  const response = await FAQ.findById(id);
  if (!response) {
    throw new APIError(404, 'FAQ not found');
  }

  const translatedFAQ =
    lang !== 'en'
      ? response.getTranslation(lang)
      : { question: response.question, answer: response.answer };
  return res
    .status(200)
    .json(new APIResponse(200, { _id: id, ...translatedFAQ }, ''));
});

const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    throw new APIError(400, 'Question and Answer are required');
  }

  const newFAQ = new FAQ({ question, answer });
  await newFAQ.save();

  return res
    .status(201)
    .json(new APIResponse(200, newFAQ, 'FAQ successfully created'));
});

const updateFAQ = asyncHandler(async (req, res) => {
  const { id, update } = req.body;
  if (!id || !update) {
    throw new APIError(400, 'FAQ ID and update data are required');
  }

  const response = await FAQ.findByIdAndUpdate(id, update, { new: true });
  if (!response) {
    throw new APIError(404, 'FAQ not found');
  }

  return res
    .status(200)
    .json(new APIResponse(200, response, 'FAQ successfully updated'));
});

const deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new APIError(400, 'FAQ ID is required');
  }

  const response = await FAQ.deleteOne({ _id: id });
  if (response.deletedCount === 0) {
    throw new APIError(404, 'FAQ not found');
  }

  return res
    .status(200)
    .json(new APIResponse(200, true, 'FAQ successfully deleted'));
});

export { getQuestion, getOneFAQ, createFAQ, updateFAQ, deleteFAQ };
