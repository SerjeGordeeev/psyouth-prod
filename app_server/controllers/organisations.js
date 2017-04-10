const mongoose = require('mongoose')
const Organisation = mongoose.model('Organisation')
//const Props = mongoose.model('Properties')
const User = mongoose.model('User')
const async = require('async')
const url = require('url')
const _ = require("lodash")

module.exports = {
	getList,
	remove,
	add,
	upload,
	update,
	getOne
}

function getList(req, res) {
	let with_members = req.query.with_members
	delete req.query.with_members;
	
	let query = Organisation.find(cleanQueryObj(req.query));
	
	query.then(organisations=>{
		if(with_members){
			let getMembersProms = _.map(organisations, org => {
					return User
						.getOrganisationMembers(org._id)
						.then(users=>{
							org.members = users;
							return org;
						});
				});
		
			return Promise.all(getMembersProms);
		} else {
			return organisations;
		}
	})
	.then(organisations=>{
		res.status(200)
		res.json(organisations)
	})
	.catch(err=>{
		dataError(res,err)
	})
}

function remove(req, res) {
	//console.log('DELETE', req.query.id)
	Organisation.findById(req.params.id).exec()
	.then((org)=>{
			return org.remove()
	})
	.then(()=>{
		res.status(200)
		res.json({
			message: 'Организация успешно удалена'
		})
	})
	.catch((err)=>{
		dataError(res,err)
	});
}

function add(req, res) {
	//console.log(req.path)
	//orgs.push({id: 666, name: null, is_psycho: false})

	let org = new Organisation()
	//org.id = 1312
	org.name = req.body.name
	org.is_psycho = req.body.is_psycho || true
	org.type = "education"

	org.save(function(err){
		if(err) dataError(res,err)
		else{
			res.status(200)
			res.json({
				message: 'Организация успешно добавлена'
			})
		}
	})

}

function update(req, res) {
	
	let query = Organisation
					.findOneAndUpdate({_id: req.params.id},req.body,{upsert:true})
					.exec()

	query.then(()=>{
			res.status(200)
			res.json({
				message: 'Данные сохранены'
			})
		})
		.catch(err=>{
			dataError(res,err)
		});
}

function upload(req, res) {
	require('./utils/upload').uploadFile(req, res, function (orgs) {

		let err = false
		orgs.forEach(org=>{
			if(!org['Название']) err = true
		})

		if(!err) {
			async.filter(orgs, function (orgData, callback) {
				let org = new Organisation()

				org.name = orgData['Название']
				org.is_psycho = !orgData['Учебная']

				org.save(function (err) {
					if (err) dataError(res, err)
					else callback(null, !err)
				})
			}, function (err) {
				if (err) dataError(res, err)
				else {
					res.status(200)
					res.json({message: 'Организации успешно импортированы'})
				}
			})
		}
		else{
			res.status(422)
			res.json({message:'Ошибка в составлении списка организаций'})
		}

	})
}

function getOne(req, res) {
	Organisation.findById(req.params.id).exec()
	.then((organisation=>{
		return User.getOrganisationMembers(organisation._id)
		.then(users=>{
			organisation.members = users
			return organisation
		})
	}))
	.then(organisation=>{
		res.status(200)
		res.json(organisation)
	})
	.catch()
}

function getTestStatistics(){

}

