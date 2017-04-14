var express=require("express"),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    methodoverride=require("method-override"),
    // expresssanitizer=require("method-sanitizer"),
    app=express();
    
//app config    
mongoose.connect("mongodb://localhost/restful");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(bodyparser.urlencoded({extended:true}));
// app.use(expresssanitizer());

//mongoose/model config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title:"test blog",
//     image:"http://www.principalspage.com/theblog/wp-content/uploads//2014/02/BlogMore2.jpg",
//     body:"hello this is a blog host"
// })


//restful routes
app.get("/",function(req,res){
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
    //method1):retrieve data from database
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    })
    //method2):without database ,just test
    // res.render("index");
})

//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
})

//create route
app.post("/blogs",function(req,res){

    Blog.create(req.body.blog,function(err,newBlog){
      if(err){
          res.render("new");
      }  
      else{
          res.redirect("/blogs");
      }
    })
})

//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
           res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog})
        }
    })
})

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    })

})

//update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
    // res.send("update route");
})

//delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs")
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
  console.log("running"); 
})
