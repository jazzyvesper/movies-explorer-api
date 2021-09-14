require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const userRoter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login, logout } = require('./controllers/users');
const errorsHandler = require('./error/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const UserError = require('./error/UserError');
const { validateSignUp, validateSignIn } = require('./middlewares/validator');
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

app.use(requestLogger); // подключаем логгер запросов

app.use(cookieParser());

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);
app.post('/signout', logout);
app.use(auth);
app.use('/users', userRoter);
app.use('/movies', moviesRouter);

app.use('*', (req, res, next) => {
  next(new UserError(404, 'Запрашиваемый ресурс не найден.'));
});

app.use(errorLogger); // подключаем логгер ошибок

// валидация запросов
app.use(errors());

// обработчик ошибок
app.use(errorsHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
