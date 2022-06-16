const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
    maxLength: 25
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 100
  }
});

module.exports = mongoose.model( 'User', UserSchema );