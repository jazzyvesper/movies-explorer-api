const router = require('express').Router();
const {
  createMovies,
  findMovies,
  deleteMovies,
} = require('../controllers/movies');

const { validateCreateMovie, validateDeleteMovies } = require('../middlewares/validator');

router.post('/', validateCreateMovie, createMovies);
router.get('/', findMovies);
router.delete('/:movieId', validateDeleteMovies, deleteMovies);

module.exports = router;
