//const process = require('process')
const mongoose = require( 'mongoose' )
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

//const MY_SECRET = process.env.SECRET

var userSchema = new mongoose.Schema({
	user_id: { type: String, required: false },
	properties: Array,
})

mongoose.model('Member', userSchema)

/*
[
	"_id":{
	[
		{
			"data":"01.09.2016",
			"value": 158,
			"actualy": true
		}

	]
}
]
*/
