const errorsHandler = (err, req, res, next) => {
  const status = err.statusCode;
  const { message } = err;

  res.status(status).send({

    message: status === 500
      ? 'На сервере произошла ошибка'
      : message,

  });
  next();
};

module.exports = errorsHandler;
