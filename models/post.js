const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  content: {
    type: String,
    required: true,
    maxLength: 400
  },
  date: {
    type: Date
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model( 'Post', PostSchema );