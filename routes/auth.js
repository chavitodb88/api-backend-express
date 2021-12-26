/**
 * Rutas de Usuarios / Auth
 * host + /api/auth
 */

const {Router} = require('express');
const {check} = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-valitador');
const router = Router();


router.post(
    '/new',
    [
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es debe de ser de 6 caracteres').isLength({min:6}),
        validateFields,
    ],
    createUser
);

router.post(
    '/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es debe de ser de 6 caracteres').isLength({min:6}),
        validateFields,
    ],
    login
);

router.get(
    '/renew',
    [
        validateJWT
    ],
    renewToken
);

module.exports = router;