const mongoose = require( 'mongoose' );
const { DateTime } = require( 'luxon' );

const Schema = mongoose.Schema;

const PostSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

PostSchema.virtual( 'dateFormatted' ).get( function() {
  return DateTime.fromJSDate( this.date ).toLocaleString( DateTime.DATE_MED );
});

module.exports = mongoose.model( 'Post', PostSchema );