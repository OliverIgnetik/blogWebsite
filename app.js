//jshint esversion:6
require('dotenv').config();
// set up packages 
const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require("ejs");

// global variables
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// EJS connection 
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// LOCAL CONNECTION
// // set up mongoose connection
// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// // Connect MongoDB at default port 27017.
// mongoose.connect('mongodb://localhost:27017/blogDB', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
// }, (err) => {
//     if (!err) {
//         console.log('MongoDB Connection Succeeded.')
//     } else {
//         console.log('Error in DB connection: ' + err)
//     }
// });

// mongoDB ATLAS deployment

// require mongoose 
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect MongoDB
mongoose.connect(process.env.MONGODB_ATLAS, {
  useNewUrlParser: true,
  useCreateIndex: true,
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.')
  } else {
    console.log('Error in DB connection: ' + err)
  }
});

// Declare the schema for blogposts 

const blogSchema = new mongoose.Schema({
  title: String, 
  content: String
});

// new collection of Blogs 
const Blog = mongoose.model("Blog",blogSchema);

// get and render the home page

app.get('/', (req, res) => {
  Blog.find({ 
  }, (err, posts) => {
     if(err){
         console.log(`Error: ` + err)
     } else{
        res.render('home', {
          posts: posts,
        });
        console.log(posts);
     }
  });
  
});

// get and render about page

app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent,
  });
});

// get and render contact page

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent,
  });
});

// get and render compose page

app.get('/compose', (req, res) => {
  res.render('compose');
});

// get individual posts 

app.get('/posts/:id', function (req, res) {
  const id = req.params.id;
  
  // check through the blogs by id
  Blog.findById( id, (err, post) => {
     if(err){
         console.log(`Error: ` + err)
     } else{
      //  render post
        res.render('post', {
          post: post,
        });
     }
  });
});

// post with compose route

app.post('/compose', (req, res) => {
  let postTitle = req.body.postTitle;
  let postContent = req.body.postContent;

  // add the post to the Blogs collection 

  const blog = new Blog({
    title:postTitle,
    content:postContent
  });

  // insert blog into blogDB object 
  blog.save();

  // redirect to the home page
  res.redirect('/compose');
});

// listen for server

let port = process.env.PORT;
if(port==null||port==''){
  port=3000;
}

app.listen(port, function () {
  console.log("Server started!");
});