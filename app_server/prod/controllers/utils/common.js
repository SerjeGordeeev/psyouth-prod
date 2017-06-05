const _ = require("lodash")

global.dataError = function dataError(res,err){
	console.warn(err)
	res.status(422)
	res.json({
		message: 'Ошибка в данных'
	})
}

global.cleanQueryObj = function cleanQueryObj(queryObj){
	for(let prop in queryObj){
		if(queryObj[prop] === 'null') queryObj[prop] = null
		if(queryObj[prop] === 'true') queryObj[prop] = true
		if(queryObj[prop] === 'false') queryObj[prop] = false
	}
	//if(queryObj._id){queryObj._id = mongoose.Types.ObjectId(queryObj._id)}
	return queryObj
}

global.updateData = function updateData(obj, data){
	
	for(let prop in data){
		obj[prop] = data[prop]
	}
}

global.updatingResponse = function(err,doc){
	if (err) dataError(res,err)
	else {
		res.status(200)
		res.json({
			message: 'Данные сохранены'
		})
	}
}

global.All = function(query) {
	let promiseArr = []

	_.forIn(query, (val, key) => {
		promiseArr.push(val);
	})

	return Promise.all(promiseArr).then(response => {
		let ix = 0;
		let result = {};
		_.forIn(query, (val, key) => {
			result[key] = response[ix];
			ix++;
		})
		return result
	})
}