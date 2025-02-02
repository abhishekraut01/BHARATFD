import express from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globelErrorHandler.js';
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

// route imports
import FAQRouter from './routes/faq.routes.js';

// route declaration
app.use('/api/v1/faqs', FAQRouter);

app.use(globalErrorHandler);

export default app;
