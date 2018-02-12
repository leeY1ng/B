var gulp = require("gulp"),
	less = require("gulp-less");

//定义testless任务 自定义任务名称
gulp.task("testless",function(){
	gulp.src("less/main.less") // 该任务针对的文件
		.pipe(less())			//该任务调用的模块
		.pipe(gulp.dest("dest"));//将在dest文件夹下生成main.css
});

//定义默认任务 任务放在数组中 
gulp.task("default",["testless"]);

//gulp.task(name[,deps],fun) 
//name 任务名称  deps 依赖任务名称 fn 回调函数

//gulp.src(globs[,options])
//执行任务处理的文件 globs 处理的文件路径 字符串或数组

//gulp.dest(path[,options])
//处理完后文件生成的路径