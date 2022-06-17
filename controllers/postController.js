const Post = require( '../models/post' );

const { body, validationResult } = require( 'express-validator' );

exports.post_list = ( req, res, next ) => {
  res.send( 'POST LIST' );
};

exports.post_create_get = ( req, res, next ) => {
  res.send( 'CREATE POST GET' );
};

exports.post_create_post = ( req, res, next ) => {
  res.send( 'CREATE POST POST' );
};