import AppError from '../utils/appError.js';

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
}

function handleCastErrorDB(err) {
  return new AppError(`invalid ${err.path}: ${err.value}`, 400);
}

function handleValidationErrorDB(err) {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = error.join('. ');
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} "${value}" already exists. please use another value.`;

  return new AppError(message, 404);
}

function handleJWTError() {
  return new AppError('invalid token. Please log in again', 401);
}
function handleJWTExpiredError() {
  return new AppError('Your token has expired!. Please log in again', 401);
}

export default function errorController(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = err;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else{
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
}
