var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose= require("mongoose");
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


//APP CONFIG

mongoose.connect("mongodb://localhost/restful_blog_app",{
useUnifiedTopology: true,
useNewUrlParser: true,
})
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.get("/", function (req, res){
	res.redirect("/blogs");
});
app.get("/blogs", function (req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else {
			res.render("index",{blogs: blogs});
		}
	});
	//res.render("index");
});
app.get("/blogs/new", function (req, res){
	res.render("new");
})

app.listen(3000, process.env.IP, function(){
	console.log("Server is running")
});

//show route
app.get("/blogs/:id",function (req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if (err) {
			res.redirect("/blogs");
				}
		else {
			res.render("show", { blog: foundBlog });
		}
	})
	//res.send("Show page!");
});

//edit route
app.get("/blogs/:id/edit", function (req, res){
	Blog.findById(req.params.id, function (err,foundBlog){
		 if(err){
		 	res.redirect("/blogs");
		 } else {
		 	res.render("edit", { blog: foundBlog });
		 }

	});
});
	
//update route
app.put("/blogs/:id" , function (req, res){
	//res.send("Update route");
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("==============");
	console.log(req.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function (err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

//delete route
app.delete("/blogs/:id", function (req, res){
Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
	if (err) {
		res.redirect("/blogs");
	}else {
		res.redirect("/blogs");
	}
});
});




//MODEL CONFIG

var blogSchema = new mongoose.Schema({
	title: String,
	image: String, //{type: String,default: "placeholder.jpg"},
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title:"test Blog",
// 	image:"https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png",
// 	body: "hello this is a blog post",

// })

app.post("/blogs", function (req, res){
	//create 
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("==============");
	console.log(req.body);
	Blog.create(req.body.blog, function (err, newBlog){
		if(err){
			res.render("new");
		}else {
			res.redirect("/blogs")
		}
	});
	//then, redirect to the index
});



// title
// image
// body
// created