var express = require("express");
var app = express();
var fortune = require("./lib/fortune.js");

//设置handlebars视图引擎
//创建了一个视图引擎并对express进行了配置
//将其作为默认的视图引擎
var handlebars = require("express3-handlebars").create({defaultLayout:"main"});
app.engine("handlebars",handlebars.engine);
app.set("view engine","handlebars");

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname+"/public"));

app.use(function(req,res,next){
	res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
	next();
});

app.get("/",function(req,res){
	res.render("home");
});
app.get("/about",function(req,res){
	res.render("about",{fortune:fortune.getFortune()});
});
//make 404 page
app.use(function(req,res,next){	
	res.status(404);
	res.render("404");
});
//make 500 page 
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render("500");
});

app.listen(app.get("port"),function(){
	console.log("Express started on http://localhost" +  app.get("port") + ";press Ctrl+c to ternimate");
});
