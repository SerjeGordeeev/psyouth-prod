module.exports = (_)=>{

	_.mixin({isUpdated})
	_.mixin({initUpdating})
	
	function isUpdated(obj) {
		console.log(obj)
		let result = false;
		_.forIn(obj, (val, key) => {
			if((key !== "oldVal" && key !== "$$hashKey")){
				if(obj.oldVal[key] !== val || obj.oldVal[key] === undefined) {
					result = true;
				}
			}
		});

		return result
	}

	function initUpdating(obj){
		obj.oldVal = _.clone(obj);
	}
};