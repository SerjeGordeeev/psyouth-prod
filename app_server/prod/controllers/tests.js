const mongoose = require('mongoose')
const Organisation = mongoose.model('Organisation')
const User = mongoose.model('User')
const Prop = mongoose.model('Property')
const Test = mongoose.model('Test')
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
  let query = Test.find(cleanQueryObj(req.query))

  query.exec().then(tests=>{
      res.status(200)
      res.json(tests)
  }).catch(err=>{
     dataError(res,err)
  });
}

function getOne(req, res) {
    Test.findById(req.params.id).exec()
        .then(test=>{
            res.status(200);
            res.json(test);
        })
        .catch()
}

function remove(req, res) {
    //console.log('DELETE', req.query.id)
    Test.findById(req.params.id).exec()
    .then((org)=>{
            return org.remove()
    })
    .then(()=>{
        res.status(200)
        res.json({
            message: 'Тест успешно удален'
        })
    })
    .catch((err)=>{
        dataError(res,err)
    });
}

function add(req, res) {

    let test = new Test()

    updateData(test, req.body)

    test.save()
    .then(()=>{
        res.status(200)
        res.json({
            message: 'Тест успешно создан'
        })
    })
    .catch((err)=>{
        dataError(res,err)
    });

}

function update(req, res) {
    
    let query = Test
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