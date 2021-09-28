const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min: 8, max: 32}).isAlphanumeric().trim(),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// активация аккаунта по ссылке
router.get('/activate/:link', userController.activate);
// перезапись токенов
router.get('/refresh', userController.refresh);
// список пользователей тестовый, только для авторизованных
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router
