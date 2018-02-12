module.exports = {
	cookieSecret:"put your cookie here",
	gmail:{
		user:"your gmail username",
		password:"your gmail password"
	},
	mongo:{
		development:{
			connectingString:"your_dev_connection_string",
		},
		production:{
			connectionString:"your_production_connection_string",
		},
	},
	authProviders:{
		facebook: {
			development: {
				appId: "your_app_id",
				appSecret: "your_app_secret"
			}
		}
	},
	consumerKey:{},
	consumerSecret:{},
	WeatherUnderground: {
		ApiKey: "450019fac5398ff8"
	}
};
//development 可以同时说明开发和生产应用 

//把认证代码绑在模块还有一个原因：
// 我们可以在其它项目里重用它
// 了解发生的细节很重要
