
module.exports = function(grunt){
	//加载插件
	// [
	// 	"grunt-cafe-mocha",
	// 	"grunt-contrib-jshint",
	// 	"grunt-exec"
	// ].forEach(function(task){
	// 	grunt.loadNpmTasks(task);
	// });

	//配置插件
	grunt.initConfig({
		cafemocha:{
			all:{src: "qa/tests-*.js",
				 options:{ul: "tdd"}
				}
		},
		jshint:{
			app:["meadowlark.js","public/**/*.js","lib/**/*.js"],
			qa:["Gruntfile.js","puiblic/qa/**/*.js","qa/**/*.js"]
		},
		exec:{
			linkchecker:{cmd:"linkcheck http://localhost:3000"}
		}
	});
	//注册任务

	grunt.loadNpmTasks("grunt-cafe-mocha");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-exec");

	grunt.registerTask("default",["cafemocha","jshint","exec"])；
}