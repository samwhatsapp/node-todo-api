const mongoose = require('mongoose');


var User = mongoose.model('User',{
	email:{
		type:String,
		required:true,
		trim:true,
		minlength:1
	},
	password:{
		type:String,
		require:false
	}
})

module.exports ={
	User:User
}

