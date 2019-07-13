//jshint esversion:6

// set up packages 
const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// EJS connection 
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// set up mongoose connection
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

// mongoDB ATLAS deployment

// // require mongoose 
// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// // Connect MongoDB at default port 27017.
// mongoose.connect('mongodb+srv://oliver:tritone_1992@ignetikcluster-00dei.mongodb.net/toDoListDB', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
// }, (err) => {
//   if (!err) {
//     console.log('MongoDB Connection Succeeded.')
//   } else {
//     console.log('Error in DB connection: ' + err)
//   }
// });

// Declare the schema for blogposts 

const blogSchema = new mongoose.Schema({
  title: String, 
  content: String
});

// new collection of Blogs 
const Blog = mongoose.model("Blog",blogSchema);

// global variables 
// const posts = [];

// get and render the home page

app.get('/', (req, res) => {
  Blog.find({ 
  }, (err, posts) => {
     if(err){
         console.log(`Error: ` + err)
     } else{
        res.render('home', {
          homeStartingContent: homeStartingContent,
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

app.get('/posts/:postTitle', function (req, res) {
  const postTitle = req.params.postTitle;
  // check for the matching post

  posts.forEach(post => {
    if (_.lowerCase(postTitle) === _.lowerCase(post.postTitle)) {
      res.render('post', {
        post:post
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
  
  // blog object for posts array 
  const post = {
    postTitle: postTitle,
    postContent: postContent
  };

  posts.push(post);

  res.redirect('/');
});

// listen for server

app.listen(3000, () => {
  console.log('Server started on 3000');
});