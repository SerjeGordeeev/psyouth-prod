const multiparty = require('multiparty')
const toJson = require('csvtojson')
const Converter = require("csvtojson").Converter;

exports.uploadFile = function(req, res, next) {

	let fs = require('fs')
	let form = new multiparty.Form()

	form.parse(req)
	form.on('file', function(name,file){
		let tmp_path = file.path
		let converter = new Converter({})
		try{
			converter.fromFile(tmp_path,function(err,result){
				if(err){
					res.status(422)
					res.json({message:'Некорректный .csv'})
				}
				else next(result)
				//console.log(result)
			})
		}
		catch(err){
			dataError(res,err)
		}
	})



};