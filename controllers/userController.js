const User = require( '../models/user' );

const bcrypt = require( 'bcryptjs' );

const { body, validationResult } = require( 'express-validator' );

//sign up funtionality
exports.userSignUpGet = ( req, res, next ) => {
  res.render( 'sign_up', {
    title: 'Sign Up'
  })
};

exports.userSignUpPost = [
  body( 'userID' ).trim().isLength({ min: 1 }).escape().withMessage( 'Username must be specified' ),
  body( 'password' ).trim().isLength({ min: 8 }).escape().withMessage( 'Password must be specified, and must be 8 characters minimum' ),
  body( 'confirm' ).trim().escape()
    .custom( ( value, { req } ) => {
      if( value !== req.body.password ) {
        throw new Error( 'Password confirmation does not match with password' );
      }
      return true;
    }),

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
          password: hashedPassword,
        }).save( ( err ) => {
          if( err ) { return next( err ); }
  
          res.redirect( '/' );
        })
      })
    }
  }
];