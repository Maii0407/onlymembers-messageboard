const express = require('express');
const router = express.Router();
const passport = require( 'passport' );

const userController = require( '../controllers/userController' );

/* GET home page. */
router.get( '/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    user: req.user
  });
});

router.get( '/sign-up', userController.userSignUpGet );
router.post( '/sign-up', userController.userSignUpPost );

router.get( '/log-in', ( req, res, next ) => {
  res.render( 'log_in', { title: 'Log In' });
});

router.post( '/log-in', passport.authenticate( 'local', {
  successRedirect: '/',
}
));

router.get( '/log-out', ( req, res ) => {
  req.logout( ( err ) => {
    if( err ) { return next( err ); }

    res.redirect( '/' );
  });
});

module.exports = router;
