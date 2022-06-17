const User = require( '../models/user' );

const { body, validationResult } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );

exports.user_create_get = ( req, res, next ) => {
  res.render( 'sign_up', {
    title: 'Sign Up'
  })
};

exports.user_create_post = [
  body( 'userID' ).trim().isLength({ min: 1 }).escape().withMessage( 'Username must be specified' ),
  body( 'password' ).trim().isLength({ min: 8 }).escape().withMessage( 'Password must be specified, and must be 8 characters minimum' ),

  ( req, res, next ) => {
    const errors = validationResult( req );

    if( !errors.isEmpty() ) {
      res.render( 'sign_up', {
        title: 'Sign Up',
        user: req.body,
        errors: errors.array()
      });
      return;
    }
    else {
      bcrypt.hash( `${ req.body.password }`, 10, ( err, hashedPassword ) => {
        if( err ) { return next( err ); }

        const user = new User({
          userID: req.body.userID,
          password: hashedPassword
        }).save( ( err ) => {
          if( err ) { return next( err ); }
  
          res.redirect( '/' );
        })
      })
    }
  }
];