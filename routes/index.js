const express = require('express');
const router = express.Router();

const user_controller = require( '../controllers/userController' );
const post_controller = require( '../controllers/postController' );

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', {
    title: 'Express'
  })
})

router.get( '/sign-up', user_controller.user_create_get);
router.post( '/sign-up', user_controller.user_create_post);

module.exports = router;
