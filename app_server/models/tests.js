const mongoose = require( 'mongoose' )

var variantSchema = new mongoose.Schema({
	value: String,
	weight: Number
});

var questionSchema = new mongoose.Schema({
	title: String,
	type: {type: String, default: "radio"},
	description: String,
	variants: {type: [variantSchema], default: []}
});

var translationSchema = new mongoose.Schema({
	range: Array,
	message: String,
	propValue: Number
});

var passingSchema = new mongoose.Schema({
	memberId: String,
	date: String,
	answers: [mongoose.Schema.Types.Mixed],
	result: Number
});

var testSchema = new mongoose.Schema({
    name: {type: String, required: false},
    propId:{ type: String, required: false},
    authorId: String,
    type: { type:String, default: "own"},
    description: {type: String, required: true},
    adress: {type: String, required: false},
    questions: {type: [questionSchema], default: []},
    translation: {type: [translationSchema], default: []},
	passings: {type:[passingSchema], default: []}
});

mongoose.model('Test', testSchema)
