const Movies = require('../models/movie');
const MovieError = require('../error/MovieError');

// Создание фильмов
const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new MovieError(400));
      } else {
        next(new MovieError(500));
      }
    });
};

// Поиск созданных пользователем фильмов
const findMovies = (req, res, next) => {
  const current = req.user._id;
  Movies.find({ owner: current })
    .then((movies) => res.send(movies))
    .catch(() => next(new MovieError(500)));
};

// удаление фильмов
const deleteMovies = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .then((movie) => {
      if (req.user._id !== String(movie.owner)) {
        next(new MovieError(403));
      } else {
        Movies.findByIdAndRemove(movieId)
          .orFail(new Error('Error'))
          .then((data) => res.send(data))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new MovieError(400));
            } else if (err.name === 'Error') {
              next(new MovieError(404));
            } else {
              next(new MovieError(500));
            }
          });
      }
    });
};

module.exports = {
  createMovies,
  findMovies,
  deleteMovies,
};
