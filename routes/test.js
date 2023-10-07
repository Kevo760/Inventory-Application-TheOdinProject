var express = require('express');
var router = express.Router();
const testController = require('../controllers/testController')

/* GET home page. */
router.get('/', testController.create_get);

router.post('/', testController.create_post);

module.exports = router;