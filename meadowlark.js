var express = require("express");
var app = express();
var fortune = require("./lib/fortune.js");


//设置handlebars视图引擎
//创建了一个视图引擎并对express进行了配置
//将其作为默认的视图引擎

// var handlebars = require("express3-handlebars").create({defaultLayout:"main"});

var handlebars = require("express3-handlebars").create({
	defaultLayout:"main",
	helpers:{
		section:function(name,options){
			if(! this._sections){
				this._sections = {};
			}
			this._sections[name] = options.fn(this);
			return null;
		}
	},
})	

app.engine("handlebars",handlebars.engine);
app.set("view engine","handlebars");

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname+"/public"));

app.use(function(req,res,next){
	res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
	next();
});

app.use(function(req,res,next){
	if(!res.locals.partials){
		res.locals.partials ={};
	}
	res.locals.partials.weather = getWeatherData();
	next();
});


app.get("/",function(req,res){
	res.render("home");
});

app.get("/about",function(req,res){
	res.render("about",{fortune:fortune.getFortune(),
						pageTestScript:"/qa/tests-about.js"
	});
});

app.get("/tours/hood-river",function(req,res){
	res.render("tours/hood-river");
});
app.get("/tours/request-group-rate",function(req,res){
	res.render("tours/request-group-rate");
});

app.get("/jquerytest",function(req,res){
	res.render("jquerytest");
})



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

function getWeatherData(){
	return {
		locations:[
			{
				name:"portland",
				forecastUrl:"http://www.wunderground.com/us/or/portland.html",
				iconUrl:"http://icons-ak.wxug.com/i/c/k/cloudy.gif",
				weather:"Overcast",
				temp:"54.1 F(12.3 C)"
			},
			{
				name:"bend",
				forecastUrl:"http://www.wunderground.com/us/or/bend.html",
				iconUrl:"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif",
				weather:"partly cloudy",
				temp:"55.0 F(12.8 C)"
			},
			{
				name:"manzanita",
				forecastUrl:"http://www.wunderground.com/us/or/manzanita.html",
				iconUrl:"http://icons-ak.wxug.com/i/c/k/rain.gif",
				weather:"light rain",
				temp:"55.0 F(12.8 C)"
			}
		],
	};
}