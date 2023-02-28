const router = require('express').Router();
const tagController = require('./controller');
const {police_check} = require('../../middlewares');

router.post('/tags', 
    police_check('create', 'Tag'),
    tagController.store
);
router.get('/tags', 
    tagController.index
);
router.put('/tags/:id', 
    police_check('update', 'Tag'),
    tagController.update
);
router.delete('/tags/:id', 
    police_check('update', 'Tag'),
    tagController.destroy
);

module.exports = router;