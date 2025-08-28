import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: true;
    message: string;
    meta?: { total: number; page: number; limit: number };
    data?: T;
  },
) => {
  const responseBody: typeof jsonData = {
    statusCode: jsonData.statusCode,
    success: jsonData.success,
    message: jsonData.message,
    data: jsonData.data,
  };

  if (jsonData.meta) {
    responseBody.meta = jsonData.meta;
  }

  res.status(jsonData.statusCode).json(responseBody);
};

export default sendResponse;
