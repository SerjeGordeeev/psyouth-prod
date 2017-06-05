//const process = require('process')
const mongoose = require( 'mongoose' )
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const _ = require("lodash")
//const MY_SECRET = process.env.SECRET

var changingSubjectSchema =  new mongoose.Schema({
	type: "String",
	subjectId: String
});

var propValueSchema =  new mongoose.Schema({
	value: mongoose.Schema.Types.Mixed,
	date: String,
	time: String,
	actually: Boolean,
	by: changingSubjectSchema
});

var propsDataSchema =  new mongoose.Schema({
	id: String,
	data: {type:[propValueSchema], default: []}
});

var userSchema = new mongoose.Schema({
	name: { type: String, required: false },
	email: { type: String, required: false },
	login: { type: String, required: false, unique: true },
	openPassword: { type: String, required: false },
	role:{ type: String, required: true },
	organisation: { type: String, required: false },
	group: { type: String, required: false },
	course: { type: String, required: false },
	birthsday: String,
	age: Number,
	gender: String,
	properties: {type:[propsDataSchema],default:[]},
	hash: String,
	salt: String
});



userSchema.virtual('_age').get(function(){ 
    return moment().diff(this.birthsday,"years");
});


userSchema.statics.getOrganisationMembers = function(org_id, cb){
	return this.find({"organisation": org_id})
	.select('name email gender role group organisation course properties birthsday age')
	.exec()
	.then(users=>{
		users = _.map(users, user=>{
			user.age = user._age
			return user
		})
		return users
	})
}

userSchema.statics.getGroupMembers = function(group_id, cb){
	return this.find({"group": group_id, role: "student"})
	.select('name email gender role group organisation course properties birthsday age')
	.exec()
	.then(users=>{
		users = _.map(users, user=>{
			user.age = user._age
			return user
		})
		return users
	})
}

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex')
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
}

userSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
	return this.hash === hash
}

userSchema.methods.generateJwt = function() {
	var expiry = new Date()
	expiry.setDate(expiry.getDate() + 7)

	let token = jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		role: this.role,
		organisation: this.organisation,
		group: this.group,
		exp: parseInt(expiry.getTime() / 1000),
	}, 'MY_SECRET') // DO NOT KEEP YOUR SECRET IN THE CODE!

	return token
}

userSchema.methods.userData = function() {
	var expiry = new Date()
	expiry.setDate(expiry.getDate() + 7)

	return {
		_id: this._id,
		email: this.email,
		name: this.name,
		role: this.role,
		organisation: this.organisation,
		group: this.group,
		exp: parseInt(expiry.getTime() / 1000)
	}
}

mongoose.model('User', userSchema)
