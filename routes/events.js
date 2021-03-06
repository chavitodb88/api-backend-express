/**
 * Events routers
 * host + /api/events
 */

const {Router} = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/fields-validator');
const { validateJWT, isAdmin } = require('../middlewares/jwt-valitador');
const router = Router();

router.use(validateJWT);

router.get('/',getEvents);
router.post(
    '/',
    [
        isAdmin,
        check('title','El título es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom(isDate),
        check('end','Fecha de fin es obligatoria').custom(isDate),
        validateFields,
    ],
    createEvent
);
router.put(
    '/:id',
    [
        isAdmin,
        check('title','El título es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom(isDate),
        check('end','Fecha de fin es obligatoria').custom(isDate),
        validateFields,
    ],
    updateEvent)
;
router.delete('/:id',isAdmin, deleteEvent);

module.exports = router;