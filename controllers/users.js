
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
 
/**
 * [SEARCH] User Collection
 */

router.get('/', function(req, res){
  console.log('[SEARCH] User');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] User Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] User");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] User
 */

router.get('/:uid', function(req, res){
  console.log('[GET] User');
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] User
 */

router.patch('/:uid', function(req, res){
    console.log('[UPDATE] User');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] User
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] User');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router