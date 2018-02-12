var cluster = require("cluster");

var express = require("express");
var app = express();

app.use(function(req,res,next){
	var cluster = require("cluster");
	if(cluster.isWorker){
		console.log("Worker %d received request",cluster.worker.id);
	}
})

function startWorker(){
	var worker = cluster.fork();
	console.log("Cluster: worker %d started:",worker.id);
}

if(cluster.isMaster){
	require("os").cpus().forEach(function(){
		startWorker();
	});

//记录所有断开的工作线程 如果工作线程断开，应该退出
//等待exit事件 然后繁衍一个新工作线程来代替它
cluster.on("disconnect",function(worker){
	console.on("cluster: worker %d disconnected from the"+
		"cluster",worker.id);
})


//当有工作线程退出，创建一个工作线程替代它
cluster.on("exit",function(worker,code,signal){
	console.log("cluster: worker %d died with exit "+
		"code %d (%s)",worker.id,code,signal);
	startWorker();
})

} else {
	//在这个工作线程上启动我们的应用服务器，
	require("./meadowlark.js")();
}
