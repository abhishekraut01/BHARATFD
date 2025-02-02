import { asyncHandler } from "../utils/AsyncHandler.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { APIError } from "../utils/ApiError.js";
import { FAQ } from "../models/faq.js";
import { languages } from "../utils/languages.js";

const getQuestion = asyncHandler(async (req, res) => {
  const lang = req.query.lang && languages.includes(req.query.lang) ? req.query.lang : "en";

  let faqs = await FAQ.find();
  
  faqs = faqs.map((faq) => {
    const translation = lang !== "en" ? faq.getTranslation(lang) : { question: faq.question, answer: faq.answer };
    return { id: faq._id, ...translation };
  });

  return res.status(200).json(new APIResponse(200, faqs, ""));
});



export { getQuestion };
