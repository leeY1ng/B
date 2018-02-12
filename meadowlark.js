const express = require("express");
const app = express();
const http = require("http");
const fortune = require("./lib/fortune.js");

const formidable = require("formidable");

const jqupload = require("jquery-file-upload-middleware");

const credentials = require("./credentials.js");

const connect = require("connect");

const fs = require("fs");

const Vacation = require("./models/vacation.js");

const VacationSeasonListener = require("./models/vacationInSeasonListener.js");

const rest = require("connect-rest");

const Q = require("q");
// var MongoSessionStore = require("session-mongoose")(require("connect"));
// var sessionStore = new MongoSessionStore({
// 	url:credentials.mongo.connectionString
// });

//var nodemailer = require("nodemailer");

// var mailTransport = nodemailer.createTransport("SMTP",{
// 	service:"Gmail",
// 	auth:{
// 		user:credentials.gmail.user,
// 		pass:credentials.gmail.password
// 	}
// });

// http.createServer(app).listen(app.get("port"),function(){
// 	console.log("express started in "+app.get("env") +
// 		"mode on http://localhost"+app.get("port")+
// 		"press strc+c to terminate");
// });


//设置handlebars视图引擎
//创建了一个视图引擎并对express进行了配置
//将其作为默认的视图引擎

// var handlebars = require("express3-handlebars").create({defaultLayout:"main"});

var handlebars = require("express3-handlebars").create({
	defaultLayout:"main",
	// helpers:{
	// 	section:function(name,options){
	// 		if(! this._sections){
	// 			this._sections = {};
	// 		}
	// 		this._sections[name] = options.fn(this);
	// 		return null;
	// 	}
	// }
	helpers: {
		static: function(name){
			return require("./lib/static.js").map(name);
		},
		section:function(name,options){
			if(! this._sections){
				this._sections = {};
			}
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
const vhost = require("vhost");
var admin = express.Router();
app.use(vhost("admin",admin));

admin.get("/",function(req,res){
	res.render("admin/home");
})
admin.get("/users",function(req,res){
	res.render("admin/users");
});

// app.use(function(req,res,next){
// 	var cluster = require("cluster");
// 	if(cluster.isWorker){
// 		console.log("Worker %d received request",cluster.worker.id);
// 	}
// });

var dataDir = __dirname + "/data";
var vacationPhotoDir = dataDir+ "/vacation-photo";
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

function saveContestEntry(contestName,email,year,month,photoPath){
	// todo .....
}

app.post("/contest/vacation/vacation-photo/:year/:month",function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		if(err){
			return res.redirect(303,"/error");
		};
		if(err){
			res.session.falsh = {
				type:"danger",
				intro:"Oops!",
				message:"there was an error preocessing"+
						"your submission,please try again"
			};
			return res.redirect(303,"/contest/vacation-photo");
		};
		var photo = files.photo;
		var dir = vacationPhotoDir +"/"+Date.now();
		var path = dir+"/"+photo.name;
		fs.mkdirSync(dir);
		fs.renameSync(photo.path,dir+"/"+photo.name);
		saveContestEntry("vacation-photo",fields.email,req.params.year,req.params.month,path);
		req.session.falsh = {
			type:"sucess",
			intro:"good luck!",
			message:"you have been entered into the contest"
		};
		return res.redirect(303,"/contest/vacation-photo/entries");
	});
});


app.engine("handlebars",handlebars.engine);
app.set("view engine","handlebars");

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname+"/public"));

app.use(require("body-parser")());


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

app.use("/upload",function(req,res,next){
	var now = Date.now();
	jqupload.fileHandler({
		uploadDir:function(){
			return __dirname+"/public/uploads"+now;
		},
		uploadUrl:function(){
			return '/uploads/'+now;
		},
	})(req,res,next);
});

app.use(require("cookie-parser")(credentials.cookieSecret));
app.use(require("express-session")());

app.use(function(req,res,next){
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

	app.use(require("cookie-parser")(credentials.cookieSecret));
	// app.use(require("express-session")({store:sessionStore}));

app.get("/contest/vacation-photo",function(req,res){
	var now = new Date();
	res.render("contest/vacation-photo",{
		year:now.getFullYear(),
		month:now.getMonth()
	});
});

app.get("/vacations",function(req,res){
	Vacation.find({available:true},function(err,vacations){
		var currency = req.session.currency || "USD";
		var context = {
			currency:currency,
			vacations:vacations.map(function(vacation){
				return {
					sku:vacation.sku,
					name:vacation.name,
					description:vacation.description,
					price:vacation.getDisplayPrice(),
					inSeason:vacation.inSeason
				};
			})
		};
		switch(currency){
			case "USD":context.currencyUSD = "selected"; break;
			case "GBP":context.currencyGBP = "selected"; break;
			case "BTC":context.currencyBTC = "selected"; break;
		};
		res.render("vacations","context");
	});
});

	app.get("/set-currency/:currency",function(req,res){
		req.session.currency = req.params.currency;
		return res.redirect(303,"/vacations");
	});

app.get("/newsletter",function(req,res){
	res.render("newsletter",{csrf:"CSRF goes here!"});
});

	app.get("/notify-me-when-in-season",function(req,res){
		res.render("notify-me-when-in-season",{sku:req.query.sku});
	});
	app.post("/notify-me-when-in-season",function(req,res){
		VacationInSeasonListener.update(
				{email:req.body.email},
				{$push: {skus:req.body.sku}},
				{upsert:true},
				function(err){
					if(err) {
					console.error(err.stack);
					req.season.flash = {
						type:"danger",
						intro:"Ooops",
						message:"there was an erro processsing your request"
					};
					return res.redirect(303,"/vacations");
				};
				req.session.flash = {
					type:"success",
					intro:"thank you",
					message:"you will notified when this vacation is in season"
				};
				return res.redirect(303,"/vacations");
			}
		);
	});

app.post("/process",function(req,res){
	console.log("form querystring:" + req.query.form);
	console.log("csrf token form hidden form field:" + req.body._csrf);
	console.log("name frome visible form field:" + req.body.name);
	console.log("email from visible for field :"+ req.body.email);
	res.redirect(303,"/thankyou");
});

app.post("/process",function(req,res){
	if(req.xhr || req.accepts("json.html") === "json"){
		res.send({success:true});
	} else {
		res.redirect(303,"/thankyou!");
	}
});

app.get("/thankyou",function(req,res){
	res.render("thankyou",{haha:"Thank You"});
});

app.post("/contest/vaction-photo/:year/:month",function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		if(err){
			return res.redirect(303,"/error");
		}
		console.log("received fields:");
		console.log(fields);
		console.log("recevieds fiels:");
		console.log(files);
		res.redirect(303,"/thankyou");
	});
});

app.post("/newsletter",function(req,res){
	var name = req.body.name || '',
	email = req.body.email || '';
	if(!email.match(VALID_EMAIL_REGEX)){
		if(req.xhr){
			return res.json({error:"invalid name email address"});
		}
		req.session.flash = {
			type:'danger',
			intro:"validation error",
			message:"the email address you entered was not valid"
		};
		return res.redirect(303,"/newsletter/archive");
	}
	new NewsletterSignup({name:name,email:email}).save(function(err){
		if(err){
			if(req.xhr){
				return res.json({error:"database erro"});
			}
			req.session.flash = {
				type:"danger",
				intro:"database error",
				message:"there was a database error:please try again later"
			};
			return res.redirect(303,"/newsletter/archive");
		}
		if(req.xhr){
			res.json({success:true});
			req.session.falsh = {
				type:"success",
				intro:"thank you",
				message:"you have now been signed up for the newsletter"
			};
			return res.redirect(303,"/newsletter/archive");
		}
	});
});
	
app.get("/nursey-rhyme",function(req,res){
	res.render("nursey");
});
app.get("/data/nursey-rhyme",function(req,res){
	res.json({
		animal:"squirrel",
		bodyPart:"tail",
		adjective:"bushy",
		noun:"heck"
	});
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

app.use("/epic-fail",function(req,res){
	process.nextTick(function(){
		throw new Error("Kaboom!");
	});
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





function convertFromUSD(value,currency){
	switch(currency){
		case "USD": return value*1;
		case "GBP": return value*0.6;
		case "BTC": return value*0.0023;
		default :return NaN;
	}
}

var getWeatherData = (function(){
	//天气缓存
	var c = {
		refreshed: 0,
		refreshing: false,
		updateFrequency: 360000,
		locations: [
			{name:"New York"},
			{name:"Seattle"},
			{name:"Washington"},
			{name:"Los Angeles"}
		]
	};
	return function(){
		if(!c.freshing && Date.now() > c.refreshed + c.updateFrequency){
			c.refreshing = true;
			const promises = [];
			c.locations.forEach(function(loc){
				const deferred = Q.defer();
				const url = "http://api.wunderground.com/api/"+
							credentials.WeatherUnderground.ApiKey+
							"/conditions/q/CA/"+loc.name+".json";
							http.get(url,function(res){
								var body = '';
								res.on("data",function(chunk){
									body += chunk;
								});
								res.on("end",function(){
									body = JSON.parse(body);

									loc.testname = 123;
									
									loc.forecastUrl = body.current_observation.forecast_url;
									loc.iconUrl = body.current_observation.icon_url;
									loc.weather = body.current_observation.weather;
									loc.temp = body.current_observation.temperature_string;
									deferred.resolve();
								});
							});
							promises.push(deferred);
			});
							Q.all(promises).then(function(){
								c.refreshing = false;
								c,refreshed = Date.now();
							});
		}
		return {locations:c.locations}
	}
})();
//初始化天启缓存
getWeatherData();




// function getWeatherData(){
// 	return {
// 		locations:[
// 			{
// 				name:"portland",
// 				forecastUrl:"http://www.wunderground.com/us/or/portland.html",
// 				iconUrl:"http://icons-ak.wxug.com/i/c/k/cloudy.gif",
// 				weather:"Overcast",
// 				temp:"54.1 F(12.3 C)"
// 			},
// 			{
// 				name:"bend",
// 				forecastUrl:"http://www.wunderground.com/us/or/bend.html",
// 				iconUrl:"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif",
// 				weather:"partly cloudy",
// 				temp:"55.0 F(12.8 C)"
// 			},
// 			{
// 				name:"manzanita",
// 				forecastUrl:"http://www.wunderground.com/us/or/manzanita.html",
// 				iconUrl:"http://icons-ak.wxug.com/i/c/k/rain.gif",
// 				weather:"light rain",
// 				temp:"55.0 F(12.8 C)"
// 			}
// 		],
// 	};
// }


// function startServer(){
// 	http.createServer(app).listen(app.get("port"),function(){
// 		console.log("express started in "+app.get("env")+
// 			"mode on http://localhost"+app.get("port")+
// 			"press control+c to terminate");
// 	});
// }

// if(require.main === module){
// 	startServer();
// } else {
// 	module.exports = startServer;
// }