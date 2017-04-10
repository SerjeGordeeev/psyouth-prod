const mongoose = require('mongoose')
const json2csv = require('json2csv');
const User = mongoose.model('User')
const Group = mongoose.model('Group')
const Organisation = mongoose.model('Organisation')
const Prop = mongoose.model('Property')
const _ = require("lodash")
const fs = require("fs")

module.exports.getBDBackup = function (req,res) {

/*	Promise.all([User.find({})]).then((err, result)=>{
		console.log(result)
	})*/
	let dumpJSON = {}
	User.find({},(err,data)=>{
		dumpJSON.users = data
		Group.find({},(err,data)=>{
			dumpJSON.groups = data
			Organisation.find({},(err,data)=>{
				dumpJSON.organisations = data
				Organisation.find({},(err,data)=>{
					dumpJSON.props = data
					dumpJSON.date = new Date()
					res.status(200)
					res.json(dumpJSON)
				})
			})
		})
	})

/*	var file = __dirname + '/utils/backup.json';
	res.download(file);*/
}

module.exports.downloadCSV = function(req, res) {
	const query = req.params.query;
	let = null;

	switch (query){
		case "organisations":
			let fields = ["Название","Тип","Кол-во представителей"]
			let orgsData = null;
			Promise.all([
					Organisation.find({}),
					User.find({})
				]).then(resp=>{
				//console.log(resp)
				resp.orgs = resp[0]
				resp.users = resp[1]
				
				orgsData = _.map(resp.orgs, org=>{
					let orgObj = {}
					orgObj[fields[0]] = org.name;
					orgObj[fields[1]] = org.is_psycho?"Психологическая":"Учебная";
					orgObj[fields[2]] =_.filter(resp.users, (user)=>{
						return user.organisation == org._id
					}).length;
					
					return orgObj;
				})

				result = json2csv({ data: orgsData, fields:fields});
				fs.writeFileSync(__dirname+"/report.csv", result)
				res.download(__dirname + "/report.csv", "Организации.csv");
			})

/*			Organisation.find({}).exec().then(orgs=>{
				orgsData = _.map(orgs, org=>{
					let orgObj = {}
					orgObj[fields[0]] = org.name;
					orgObj[fields[1]] = org.is_psycho?"Психологическая":"Учебная";
					orgObj[fields[2]] = "228";
					//console.log(orgsObj)
					return orgObj;
				})

				result = json2csv({ data: orgsData, fields:fields});
				fs.writeFileSync(__dirname+"/report.csv", result)
				res.download(__dirname + "/report.csv", "Организации.csv");
			})*/
		/*result = getOrganisations();*/
		break;
	}
}