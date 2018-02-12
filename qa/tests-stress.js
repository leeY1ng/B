var loadtest = require("loadtest");
var expect = require("chai").expect;

suite("Stress test",function(){
	test("Homepage should handle 100 requests in a second", function(donw){
		var options = {
			url:"http://localhost:3000",
			concurrency:4,
			maxRequests:100
		};
		loadtest.loadTest(options,function(err,result){
			expect(!err);
			expect(result.totalTimeSecond <1);
			done();
		})
	});
});