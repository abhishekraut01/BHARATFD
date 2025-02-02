import { APIResponse } from '../utils/ApiResponse.js';

const globalErrorHandler = (err, _, res, next) => {
  if (err instanceof APIError) {
    const response = new APIResponse(err.statusCode, null, err.message);
    return res.status(err.statusCode).json(response);
  }

  console.error('Unexpected Error:', err);

  const response = new APIResponse(500, null, 'Internal Server Error');
  return res.status(500).json(response);
};

export default globalErrorHandler;
