var passport = require('passport')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var generatePassword = require('password-generator');
const _ = require("lodash")
let sendMail = require('./utils/mailer')

var sendJSONresponse = function(res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   })
  //   return
  // }

  var user = new User();
  let password;

  _.assign(user,req.body);

  if(!user.password){
    password = generatePassword(6, false);
    console.log(password);
  } else {
    password = user.password;
  }



  /*  user.name = req.body.name
   user.email = req.body.email
   user.login = req.body.login
   user.organisation = req.body.organisation*/

  user.openPassword = password;
  /*  user.role = 'psycholog'
   user.group = null*/

  console.log('Registration', user.name, user.login, password);

  //sendMail(user.email ,password,user) //посылаем данные для входа

  user.setPassword(password)

  user.save(function(err) {
    var token
    token = user.generateJwt()
    res.status(200)
    res.json({
      "token" : token
    })
  })

}

module.exports.login = function(req, res) {

  if(req.body.id){
    User.find({_id:mongoose.Types.ObjectId(req.body.id)},(err, user)=>{
      if(err) dataError(res,err)
      else{
        let token = (new User()).generateJwt.call(user)
        res.status(200)
        res.json({
          "token" : token
        })

      }
    })
  }else{
    passport.authenticate('local', function(err, user, info){
      let token

      // If Passport throws/catches an error
      if (err) {
        res.status(404).json(err)
        return
      }

      // If a user is found
      if(user){
        token = user.generateJwt()
        res.status(200)
        res.json({
          "token" : token
        })
      } else {
        // If user is not found
        res.status(401).json(info)
      }
    })(req, res)
  }

}