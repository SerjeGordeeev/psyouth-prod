const mongoose = require( 'mongoose' )

var organisationSchema = new mongoose.Schema({

	name: {type: String, required: false},
	is_psycho: {type: Boolean, required: true},
	type: {type: String, required: false},
	members: {type: Array, required: false}
})

mongoose.model('Organisation', organisationSchema)
