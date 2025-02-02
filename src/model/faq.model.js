import mongoose from 'mongoose';
import translate from 'google-translate-api-x';
import { languages } from '../utils/languages.js';
import { ParseDOM } from '../utils/parseDOM.js';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    translations: {
      hi: { question: String, answer: String },
      bn: { question: String, answer: String },
    },
  },
  { timestamps: true }
);

const translateText = async (text, lang) => {
  try {
    const response = await translate(text, { to: lang });
    return response.text;
  } catch (error) {
    console.error(`Error while translating to ${lang}:`, error);
    return text;
  }
};

faqSchema.pre('save', async function (next) {
  if (this.isModified('question')) {
    const translationPromises = languages.map(async (lang) => {
      const translatedQuestion = await translateText(this.question, lang);
      return { lang, text: translatedQuestion };
    });
    const translations = await Promise.all(translationPromises);
    translations.forEach(({ lang, text }) => {
      this.translations[lang] = this.translations[lang] || {};
      this.translations[lang].question = text;
    });
  }

  if (this.isModified('answer')) {
    await ParseDOM(this);
  }

  next();
});

faqSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.question) {
    const translationPromises = languages.map(async (lang) => {
      const translatedQuestion = await translateText(update.question, lang);
      return { lang, text: translatedQuestion };
    });
    const translations = await Promise.all(translationPromises);
    translations.forEach(({ lang, text }) => {
      update[`translations.${lang}.question`] = text;
    });
  }

  if (update.answer) {
    await ParseDOM(update);
  }

  this.setUpdate(update);
  next();
});

faqSchema.methods.getTranslation = function (lang) {
  return (
    this.translations[lang] || { question: this.question, answer: this.answer }
  );
};

export const FAQ = mongoose.model('FAQ', faqSchema);
