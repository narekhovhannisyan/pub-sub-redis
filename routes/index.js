const express = require('express')
const router = express.Router()
const publishRequest = require('../lib/pub-sub.js').publishRequests

router.use(publishRequest)

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log(req.method)
  res.render('index', { title: 'Express' })
})

module.exports = router
