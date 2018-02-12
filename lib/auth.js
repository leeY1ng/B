const User = require("../models/user.js"),
  passport = require("passport"),
  FacebookStrategy = require("facebook-passport").Strategy;

passport.serializeUser(function(user,done){
	done(null,user._id);
});

passport.deserializeUser(function(id,none){
	User.findById(id,function(err,user){
		if(err || !user){
			return done(err,null);
		}
		done(null,user);
	});
});
//passport通过serializeUser和deserializeUser将请求映射到认证用户上，
//允许你使用任何存储方法
//只在会话存了一个用户id，当有需要的时候，会从数据库中查找这个id 得到user模型的实例

//实现了这两个方法，只要有活跃的会话并且用户成功通过认证
//req.session.passport.user 就会对应user模型的实例

//选择输入什么
//启用passport功能 ：
// 需要初始化passport并注册处理认证
// 从第三方认证服务重定向到回调的路由



// 在主程序文件中 可能想要选择把passport连接到中间件链条的时机

// 不准备让模块输出函数做这些事，而是让它返回一个函数，
// 这个函数返回的对象有我们需要的方法

// 一开始为什么不只是返回一个对象？
// 因为需要植入一下配置值
// 此外需要将passport中间件连入我们的应用程序，函数比较容易传入express应用程序对象中 


module.exports = function(app,options){
	//如果没有指定成功和失败的重定向地址
	//设定一些合理的默认值
	if(!options.successRedirect){
		options.successRedirect = "/account";
	}
	if(!options.failureRedirect){
		options.failureRedirect = "/login";
	}
	return {
		init: function(){
			passport.use(new GooleStrategy({
				returnURL: 'https:/\/'+ host + "/auth/goole/return",
				realm: "https:/\/" + host + "/"
			},function(identifier,profile,done){
				const authId = "google" + identifier;
				User.findOne({authId:authId},function(err,user){
					if(err){
						return done(err,null);
					}
					if(user){
						return done(null,user);
					}
				user = new User({
				authId: authId,
				name: profile.displayName,
				created: Date.now(),
				role: "customer"
			});
			user.save(function(err){
				if(err){
					return done(err,null);
				}
				done(null,user);
			});
		});
	}));
		},
		registerRoutes: function(){
			app.get("/auth/google",function(req,res,next){
				passport.authenticate("google",{
					callbackURL: "/auth/google/callback?redirect="+encodeURIComponent(req.query.redirect)
				})(req,res.next);
			});
			app.get("/auth/google/callback",passport.authenticate("google",
				{failureRedirect:options.failureRedirect},
				function(req,res){
					//认证成功才会到这里
					res.render(303,req.query.redirect || options.successRedirect);
				};
				));
		}
	}
};

// 在探讨 init 和 registerRoutes 细节之前 先看下如何使用这个模块，

const auth = require("./lib/auth.js")(app,{
	providers: credentials.authProviders,
	successRedirect: "/account",
	failureRedirect: "/unauthorized"
});
auth.init();

//auth init()链入了passport中间件

//现在可以指定auth路由
auth.registerRoutes();

// 除了指定成功和失败时的重定向路径，还指定了一个providers属性，
// 已经把它抽离到credentials文件中了
// 还需要把authProviders属性添加到 credentials.js文件中





