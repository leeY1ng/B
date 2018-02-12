const mongoose = require("mongoose");

const userSchema = ({
	authId: String,
	name: String,
	email: String,
	role: String,
	created: Date
});

const User = mongoose.model("User",userSchema);
module.exports = User;