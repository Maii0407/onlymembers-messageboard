const User = require( '../models/user' );

const bcrypt = require( 'bcryptjs' );
const async = require( 'async' );
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
          membership: 'regular'
        }).save( ( err ) => {
          if( err ) { return next( err ); }
  
          res.redirect( '/' );
        })
      })
    }
  }
];

exports.userUpgradeGet = ( req, res, next ) => {
  User.findById( req.params.id ).exec( ( err, currentUser ) => {
    if( err ) { return next( err ); }
    if( currentUser == null ) {
      const err = new Error( 'USER not found' );
      err.status = 404;
      return next( err );
    }

    res.render( 'upgrade_form', {
      title: 'Upgrade Membership',
      currentUser: currentUser
    });
  });
};

exports.userUpgradePost = [
  body( 'secretCode', 'This must not be empty' ).trim().isLength({ min: 1 }).escape(),

  ( req, res, next ) => {
    const errors = validationResult( req );

    if( req.body.secretCode === 'superSecretVIP' ) {
      const user = new User({
        userID: req.params.userID,
        password: req.params.password,
        membership: 'VIP',
        _id: req.params.id
      });

      if( !errors.isEmpty() ) {
        res.render( 'upgrade_form', {
          title: 'Upgrade Membership',
          currentUser: user,
          errors: errors.array()
        });
        return;
      }
      else {
        User.findByIdAndUpdate( req.params.id, user, {}, ( err, theuser ) => {
          if( err ) { return next( err ); }
  
          res.redirect( '/' );
        })
      }
    }
    if( req.body.secretCode === 'superSecretADMIN' ) {
      const user = new User({
        userID: req.params.userID,
        password: req.params.password,
        membership: 'ADMIN',
        _id: req.params.id
      });

      if( !errors.isEmpty() ) {
        res.render( 'upgrade_form', {
          title: 'Upgrade Membership',
          currentUser: user,
          errors: errors.array()
        });
        return;
      }
      else {
        User.findByIdAndUpdate( req.params.id, user, {}, ( err, theuser ) => {
          if( err ) { return next( err ); }
  
          res.redirect( '/' );
        })
      }
    }
  }
];