const express  = require('express')
//const db = require('./db')
require('./models/db')
require('./config/passport')
require('./controllers/utils/common')

const passport = require('passport')
const rotesApi = require('./routes')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', express.static( __dirname + '/client'))

app.use(passport.initialize())
app.use('/api', rotesApi)

module.exports = app

let staticRouts = [
	'home',
	'groups',
	'organisations',
	'members',
	'psychologs',
	'auth',
	'props',
	'my_group',
	'admin',
	'analize'
];

initStaticRouts(staticRouts)
function initStaticRouts(routs){
	routs.forEach(route =>{
		app.use(`/${route}*`,express.static('client'))
	})
}
