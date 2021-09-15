require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000 } = process.env;
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorsHandler = require('./error/errorsHandler');
const { requestLogger, errorLogger } = require('./error/logger');
const router = require('./routes/index');
const { limiter } = require('./middlewares/limiter');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(helmet());
app.use(limiter);
// подключаем логгер запросов
app.use(requestLogger);

// подключаемя куки
app.use(cookieParser());

// поделючаем роуты
app.use(router);

// подключаем логгер ошибок
app.use(errorLogger);

// валидация запросов
app.use(errors());

// обработчик ошибок
app.use(errorsHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
