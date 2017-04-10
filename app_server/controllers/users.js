const mongoose = require('mongoose');
const User = mongoose.model('User');
const Props = mongoose.model('Property');
const _async = require('async');
const generateLogin = require('password-generator');
const generatePassword = generateLogin;
const Upload = require('./utils/upload');
const _ = require("lodash");


const await = require('asyncawait/await');
/*const async = require('asyncawait/async');*/

module.exports = {
  remove,
  update,
  getList,
  add,
  upload,
  getOne
}

function getList(req, res) {
  let selectString = 'name role group organisation gender email properties course age birthsday';

  if(!_.isUndefined(req.query.with_auth_data)){
    selectString += ' login openPassword';
    delete req.query.with_auth_data;
  }

  let query = User.find(cleanQueryObj(req.query))
                  .select(selectString)

  query.exec().then(users=>{
      res.status(200)
      res.json(users)
  }).catch(err=>{
     dataError(res,err)
  });
}

function update(req, res) {

  if(req.body.ids){
      _async.filter(req.body.members, function(member, callback) {
        User.findOne({'_id':  mongoose.Types.ObjectId(member._id)}, (err,user)=>{
            if(err) dataError(res,err)
            else{
              updateData(user, member)
              user.save((err)=>{
                if(err) dataError(res,err)
                else callback(null, !err)
              })
            }
        })
      },function(err, results){
        if(err) dataError(res,err)
        else {
          res.status(200)
          res.json({message:'Участники успешно добавлены в группу'})
        }
      })
  }
  else{
    User.findOneAndUpdate({_id: req.params.id}, req.body, {upsert:true}).exec()
      .then(user=>{
        res.status(200)
        res.json({
          message: 'Данные сохранены'
        })
      }).catch(err=>{
        dataError(res,err)
      })

/*    User.findById(req.params.id}, function (err, doc) {
      if (err) dataError(res,err)
      else {
        //let queries = []
        updateData(doc, req.body)
        if(doc.group){
          User.update({group: doc.group, role: 'psycholog'}, { group: null }, {}, function(err){
            if(err) dataError(err)
            else doc.save(function(err){
              if (err) dataError(res,err)
              else {
                res.status(200)
                res.json({
                  message: 'Данные сохранены'
                })
              }
            })
          })
        }
        else doc.save(function(err){
          if (err) dataError(res,err)
          else {
            res.status(200)
            res.json({
              message: 'Данные сохранены'
            })
          }
        })
      }
    })*/
  }

}


function add(req, res) {

  let user = new User()

  _.assign(user, req.body)

  if (!user.role) {
    user.role = "student";
  }

  saveUser(user, res)
  
}

function upload(req, res) {
  Upload.uploadFile(req, res, function (users) {

    let beginDate = '17.11.2016', endDate;

    Props.find({}, (err, props)=>{

      let error = false
      users.forEach(user=>{
        if(!user['Студент']) err = true
      })

      if(!error) {
        _async.filter(users, function (userData, callback) {

          let user = new User()

          user.name = userData['Студент']
          user.course = userData['Курс']

          userData.props = {}

          for(let prop in userData){
            if(prop.includes('было')) {
              let name = prop.replace(' было', '')
              if(!userData.props[name]){
                userData.props[name] = []
              }
              userData.props[name].push({
                actually : true,
                date : beginDate,
                value : userData[prop]
              })
            }
            if(prop.includes('стало')) {
              let name = prop.replace(' стало', '')
              if(!userData.props[name]){
                userData.props[name] = []
              }
              userData.props[name].push({
                actually : true,
                date : endDate,
                value : userData[prop]
              })
            }
          }
         // console.log(userData.props)

          user.properties = []
          props.forEach(prop => {
           // console.log(prop.name)
            try{
              if(userData.props[prop.name]){
              //  console.log('nice')
                user.properties.push({
                  _id: prop._id,
                  actuallVal: userData.props[prop.name].find(item=>item.actually).value,
                  data: userData.props[prop.name]
                })
              }
            }
            catch(err){
              console.log(userData.props[prop.name],prop)
              throw err
            }

          })
         // console.log(user.properties)
          user.organisation = req.query.id
          user.role = 'student'
          user.login = generateLogin(12, false)
          //console.log(user)
          // console.log('User login', user.login)
          saveUser(user, res, callback)

        }, function (err) {
          if (err) dataError(res, err)
          else {
            res.status(200)
            res.json({message: 'Представители успешно импортированы'})
          }
        })
      }
      else{
        res.status(422)
        res.json({message: 'Ошибка в составлении списка пользователей'})
      }

    })

  })
}

function saveUser(user, res, callback){
    console.log(user)
    User.find({}, (err, users)=>{

      user.login = generateLogin(12, false)

      while(users.find(profile=>profile.login == user.login)){
        user.login = generateLogin(12, false)
      }

      let password = generatePassword(6, false)
      user.setPassword(password)
      user.openPassword = password

      user.save(function (err) {
        if (err) dataError(res, err)
        else if(callback) callback(null, !err)
        else{
          res.status(200)
          res.json({
            message: 'Участник успешно добавлен'
          })
        }
      })

    })
}

function remove(req, res) {
  User.findById(req.params.id).then((user)=> {
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
  User.findById(req.params.id).exec()
  .then(user=>{
    res.status(200)
    res.json(user)
  })
  .catch()
}