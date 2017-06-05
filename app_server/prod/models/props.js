const mongoose = require( 'mongoose' )

var propertySchema = new mongoose.Schema({
    name: {type: String, required: false},
    type: {type: String, required: false},
    description: {type: String, required: false},
    min: {type: Number, required: false},
    max: {type: Number, required: false},
    color: {type: String, required: false, default: "#544571"}
})

mongoose.model('Property', propertySchema)
