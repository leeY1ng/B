var mongoose = require("mongoose");
var vacationSchema = mongoose.Schema({
	name:String,
	slug:String,
	category:String,
	sku:String,
	description:String,
	priceInCents:Number,
	tags:[String],
	inSeason:Boolean,
	available:Boolean,
	requiresWaiver:Boolean,
	maximumGuests:Number,
	notes:String,
	packagesSold:Number
});

vacationSchema.methods.getDisplayPrice = function(){
	return "$"+(this.priceInCents/100).toFixed(2);
}
var Vacation = mongoose.model("Vacation",vacationSchema);
module.exports = Vacation;

Vacation.find(function(err,vacations){
	if(vacations.length){
		return;
	};
	new Vacation({
		name:"Hood River Day Trip",
		slug:"hood-river-day-trip",
		category:"Day Trip",
		sku:"HR199",
		description:"Spned a day sailing on the land",
		proceInCents:9995,
		tags:["day trip","hood river","sailing","windsurfing","breweries"],
		inSeason:true,
		maximumGuests:16,
		available:true,
		packagesSold:0
	}).save();
})




// var arr =[
//     [0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,1,0,0,0,1,0,0],
//     [0,0,0,0,1,0,0,0,1,0,0],
//     [0,0,0,0,1,0,0,0,1,0,0],
//     [0,0,0,0,1,0,0,0,0,0,0],
//     [0,0,0,0,1,0,0,0,0,0,0],
//     [0,0,0,0,1,1,1,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0],
// ] ;

// function findTheNeibourNumber([x,y],arr){
// 	var result = [];
// 	for(var i=0;i<arr.length;i++){
// 		for(var j=0;j<arr[i].length;j++){
// 			if(i===x && j===y){
// 				if(arr[i][j]===1){

// 				}
// 			}
// 		}
// 	}

// 	function findSimilarNum(i,j,arr){
// 		up: arr[i-1][j]
// 		down:arr[i+1][j]
// 		left:arr[i][j-1]
// 		right:arr[i][j+1];
// 		if(arr[i-1][j]===1){

// 		}

// 		up();
// 		down();
// 		left();
// 		right();
// 	}

// 	function down(a,b){
// 		while(arr[a+1][b] == 1){
// 			result.push([a+1,b]);
// 			down(a+1,b);
// 		}
// 		return;
// }
// function up(a,b){
// 	while(arr[a-1][b]==1){
// 		result.push([a-1][b]);
// 		up(a+1,b);
// 	}
// 	return [a-1,b];
// }