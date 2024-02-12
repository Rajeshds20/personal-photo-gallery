const router = require('express').Router();

const userAuth = require('../middleware/userAuth');

const { newUser, loginUser, logoutUser, getUser } = require('../controllers/userController');

router.post('/register', newUser);
router.post('/login', loginUser);
router.get('/logout', userAuth, logoutUser);
router.get('/user', userAuth, getUser);

module.exports = router;
