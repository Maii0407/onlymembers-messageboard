const Post = require( '../models/post' );
const User = require( '../models/user' );

const { body, validationResult } = require( 'express-validator' );
const async = require( 'async' );

exports.postList = ( req, res, next ) => {
  res.send( 'POST LIST' );
};

exports.postCreateGet = ( req, res, next ) => {
  res.render( 'post_form', {
    title: 'Create a Post',
    currentUser: req.user
  })
};

exports.postCreatePost = [
  body( 'title', 'Post title is required' ).trim().isLength({ min: 1 }).escape(),
  body( 'content', 'Post content is required' ).trim().isLength({ min: 1 }).escape(),

  ( req, res, next ) => {
    const errors = validationResult( req );

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      user: req.user._id
    });

    if( !errors.isEmpty() ) {
      res.render( 'post_form', {
        title: 'Create a Post',
        currentUser: req.user,
        errors: errors.array()
      });
      return;
    }
    else {
      post.save( ( err ) => {
        if( err ) { return next( err ); }

        res.redirect( '/' );
      });
    }
  }
];