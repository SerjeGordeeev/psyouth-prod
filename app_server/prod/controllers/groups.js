const mongoose = require('mongoose')
const Organisation = mongoose.model('Organisation')
const User = mongoose.model('User')
const Group = mongoose.model('Group')
const async = require('async')
const url = require('url')
const _ = require('lodash')


module.exports = {
	getList,
	remove,
	getOne,
	update,
	add,
	getReport
}

function getList(req, res) {

	let with_members = req.query.with_members
	let ids = req.query.ids? req.query.ids.split(",") : null

	delete req.query.with_members;
	delete req.query.ids;

	if(ids){
		Group.getByIds(ids, req.query.body)
			.then(groups=>{
				res.status(200)
				res.json(groups)
			})
			.catch(err=>{
				dataError(res,err)
			})
	} else {
		Group.find(req.query.body).exec()
			.then(groups=>{
				if (with_members) {
					let getMembersProms = _.map(groups, group => {
							return User
								.getGroupMembers(group._id)
								.then(users=>{
									group.members = users;
									return group;
								});
						});
				
					return Promise.all(getMembersProms);
				}

				return groups;
			})
			.then(groups=>{
				res.status(200)
				res.json(groups)
			})
			.catch(err=>{
				dataError(res,err)
			})
	}

}

function add(req, res) {
	//console.log(req.path)
	//orgs.push({id: 666, name: null, is_psycho: false})

	let group = new Group()
	//group.id = 1312
	group.name = req.body.name
	group.members = []
	group.mentor = null

	group.save(function(err){
		if(err) dataError(res,err)
		else{
			res.status(200)
			res.json({
				message: 'Группа успешно добавлена'
			})
		}
	})

}

function update(req, res) {
	Group.findOne({'_id': mongoose.Types.ObjectId(req.body.id)}, function (err, doc) {
		if (err) dataError(res,err)
		else {
			updateData(doc, req.body)
			doc.save(err=> {
				if (err) dataError(res,err)
				else {
					res.status(200)
					res.json({
						message: 'Данные сохранены'
					})
				}
			})
		}
	})

}

function remove(req, res) {
  Group.findById(req.params.id).then((user)=> {
    return user.remove()
  }).then(()=> {
    res.status(200);
    res.end();
  }).catch(err => {
    console.log(err)
    res.status(err.status);
    res.end();
  })
}

function getOne(req, res) {
	Group.findById(req.params.id).exec()
	.then((group=>{
		return User.getGroupMembers(group._id)
		.then(users=>{
			group.members = users
			return group
		})
	}))
	.then(group=>{
		res.status(200)
		res.json(group)
	})
	.catch()
}

function getReport(req, res){
	const query = req.params.query;
	let = null;


	let fields = ["Название","Тип","Кол-во представителей"]
	let orgsData = null;
	Promise.all([
			Group.find({}),
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
}