const mongoose = require( 'mongoose' )
const _ = require("lodash")
var groupSchema = new mongoose.Schema({
	name: { type: String, required: false },
	mentor: { type: String, required: false },
	members: { type: Array, required: false }
})

groupSchema.statics.getByIds = function(ids, query){
	console.log(ids)
	return this.find(_.assign({_id: {$in: ids}},query)).exec()
			.then(array=>{
/*				console.log(array)
				var objects = {};
			    array.forEach(o => objects[o._id] = o);
			    var dupArray = ids.map(id => objects[id]);*/
			    return array;
			})
}

mongoose.model('Group', groupSchema)