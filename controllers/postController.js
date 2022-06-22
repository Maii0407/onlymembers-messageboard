const Post = require( '../models/post' );
const User = require( '../models/user' );

const { body, validationResult } = require( 'express-validator' );
const async = require( 'async' );

exports.postList = ( req, res, next ) => {
  Post.find({}, 'title content date user').sort({ date: -1 }).populate( 'user' )
    .exec( ( err, list_posts ) => {
      if( err ) { return next( err ); }

      res.render( 'index', {
        title: 'onlyMembers',
        post_list: list_posts,
        user: req.user
      });
    })
};

exports.postCreateGet = ( req, res, next ) => {
  res.render( 'post_form', {
    title: 'Create a Post',
    currentUser: req.user
  })
};

exports.postCreatePost = [
  body( 'title', 'Post title is required' ).trim().isLength({ min: 1 }).isLength({ max: 25 }).escape(),
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

exports.postDeleteGet = ( req, res, next ) => {
  Post.findById( req.params.id ).exec( ( err, post ) => {
    if( err ) { return next( err ); }
    if( post == null ) {
      res.redirect( '/create-post' )
    }

    res.render( 'post_delete', {
      title: 'Delete Post',
      post: post
    });
  });
};

exports.postDeletePost = ( req, res, next ) => {
  Post.findById( req.body.postid ).exec( ( err, post ) => {
    if( err ) { return next( err ); }

    Post.findByIdAndRemove( req.body.postid, deletePost = ( err ) => {
      if( err ) { return next( err ); }

      res.redirect( '/' )
    });
  })
};