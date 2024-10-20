export const errorHandler = (statusCode, message, sucess) => {
  const error = new Error();
  error.status = statusCode;
  error.message = message;
  error.sucess = sucess;
  return error;
};
