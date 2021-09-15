const router = require('express').Router();
const userRoter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validator');
const UserError = require('../error/UserError');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.post('/signout', logout);
router.use(auth);
router.use('/users', userRoter);
router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new UserError(404, 'Запрашиваемый ресурс не найден.'));
});

module.exports = router;
