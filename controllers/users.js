const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const UserError = require('../error/UserError');

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id, email: user.email,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new UserError(400));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new UserError(409));
      } else {
        next(new UserError(500));
      }
    });
};

// Вход в систему
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      // sameSite: 'none',
      // secure: true,
      })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserError(400));
      } else if (err.name === 'Error') {
        next(new UserError(401));
      } else {
        next(new UserError(500));
      }
    });
};

// Выход из системы
const logout = (req, res) => {
  res.clearCookie('jwt', {
    sameSite: 'none',
    secure: true,
  });
  res.status(201).send(
    { message: 'Вы вышли из системы' },
  );
};

// Поиск пользователей
const findUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => next(new UserError(500)));
};

// Поиск пользователя профиля
const findCurrent = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(() => next(new UserError(500)));
};

// Изменение даанных пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new Error('Error'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserError(400));
      } else if (err.name === 'Error') {
        next(new UserError(400));
      } else {
        next(new UserError(500));
      }
    });
};

module.exports = {
  createUser,
  login,
  logout,
  findUser,
  findCurrent,
  updateUser,
};
