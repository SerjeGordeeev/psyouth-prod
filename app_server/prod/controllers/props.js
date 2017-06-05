const mongoose = require('mongoose')
const Organisation = mongoose.model('Organisation')
const User = mongoose.model('User')
const Prop = mongoose.model('Property')
const async = require('async')
const url = require('url')
const _ = require("lodash")


module.exports = {
    getList,
    remove,
    add,
    update,
    getOne
}

function getList(req, res) {
    Prop.find(req.query.id?{_id:mongoose.Types.ObjectId(req.query.id)}:{}, (err, groups)=>{
        if(err) dataError(res,err)
        else{
            res.status(200)
            res.json(groups)
        }
    })
}

function remove(req, res) {
    //console.log('DELETE', req.query.id)
    Prop.findById(req.params.id).exec()
    .then((prop)=>{
        User.find({role: "student"}).then(users=>{
            _.forEach(users, user=>{
                //console.log('--->',user.name)
                _.forEach(user.properties, (propVal, ix)=>{
                        //console.log('--------->',propVal._id , prop._id, _.toString(propVal._id) == _.toString(prop._id));
                        if (_.toString(propVal._id) == _.toString(prop._id)) {
                            user.properties.splice(ix,1);
                            //console.log(user)
                            user.save().then(()=>{console.log(` Remove prop ${prop.name} from user ${user.name}`)})
                        }
                });
            });
        });

        return prop.remove()
    })
    .then(()=>{
        res.status(200)
        res.json({
            message: 'Характеристика успешно удалена'
        })
    })
    .catch((err)=>{
        dataError(res,err)
    });
}

function add(req, res) {

    let prop = new Prop()

    updateData(prop, req.body)

    prop.save(function(err){
        if(err) dataError(res,err)
        else{
            res.status(200)
            res.json({
                message: 'Характеристика успешно добавлена'
            })
        }
    })

}

function update(req, res) {
    
    let query = Prop
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

function getOne(req, res) {
    Prop.findById(req.params.id).exec()
        .then(test=>{
            res.status(200);
            res.json(test);
        })
        .catch()
}