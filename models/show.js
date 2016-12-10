var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//used for sluggifying
var URLSlugs = require('mongoose-url-slugs');

var commentSchema = new Schema({
    posted: Date,
    author: String,
    text: String
});

var showSchema = new Schema({
  show_name:String,
  genre: [{
  type: String
}],
  year_released: Number,
  description: String,
  imageFilename: String,
  comments: [commentSchema],
    favorites: Number
});



//all the data
/*
var showSchema = new Schema({
  show_name:String,
  genre: [{
  type: String
}],
  year_released: Number,
  description: String,
  imageFilename: String,
  comments: [{ 
    posted:Date,
    author: String,
    text: String
  }],
    favorites: Number
});
*/

//COMMENTS ARE BASICALLY SUBMITTED THROUGH A FORM
//SO JUST DO THE SAME THING AS YOU DID FOR NEW SHOW??? RIGHT???? JUST FIGURE OUT WHERE TO PUT THE COMMENTS

//slugifies weird names (for example, ones with spaces in between them)
//so Watson Lau = watson-lau to prevent weird URLs
showSchema.plugin(URLSlugs('show_name', {field: 'slug'}));

var Show = mongoose.model('Show', showSchema);
// when we require this file, we get Show model
module.exports = Show;
