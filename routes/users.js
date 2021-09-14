const router = require('express').Router();
const {
  findUser,
  findCurrent,
  updateUser,
} = require('../controllers/users');

const { validateUpDateUser } = require('../middlewares/validator');

router.get('/', findUser);
router.get('/me', findCurrent);
router.patch('/me', validateUpDateUser, updateUser);

module.exports = router;
