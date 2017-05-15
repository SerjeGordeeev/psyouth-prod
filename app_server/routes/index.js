const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
})

const ctrlUsers = require('../controllers/users')
const ctrlAuth = require('../controllers/authentication')
const ctrlOrgs = require('../controllers/organisations')
const ctrlGroups = require('../controllers/groups')
const ctrlProps = require('../controllers/props')
const ctrlAdmin = require('../controllers/admin')
const ctrlTests = require('../controllers/tests')

// users
router.get('/users', ctrlUsers.getList)
router.get('/users/:id', ctrlUsers.getOne)
router.post('/users', ctrlUsers.add)
router.post('/users/upload', ctrlUsers.upload)
router.delete('/users/:id', ctrlUsers.remove)
router.put('/users/:id', ctrlUsers.update)

// authentication
router.post('/auth/sign_up', ctrlAuth.register)
router.post('/auth/login', ctrlAuth.login)

//organisations
router.get('/organisations', ctrlOrgs.getList)
router.get('/organisations/:id', ctrlOrgs.getOne)
router.post('/organisations', ctrlOrgs.add)
router.post('/organisations/upload', ctrlOrgs.upload)
router.delete('/organisations/:id', ctrlOrgs.remove)
router.put('/organisations/:id', ctrlOrgs.update)

//groups
router.get('/groups', ctrlGroups.getList)
router.get('/groups/report', ctrlGroups.getReport)
router.get('/groups/:id', ctrlGroups.getOne)
router.post('/groups', ctrlGroups.add)
router.delete('/groups/:id', ctrlGroups.remove)
router.put('/groups/:id', ctrlGroups.update)

//properties
router.get('/properties', ctrlProps.getList)
router.get('/properties/:id', ctrlProps.getOne)
router.post('/properties', ctrlProps.add)
router.delete('/properties/:id', ctrlProps.remove)
router.put('/properties/:id', ctrlProps.update)

//tests
router.get('/tests', ctrlTests.getList)
router.get('/tests/:id', ctrlTests.getOne)
router.post('/tests', ctrlTests.add)
router.delete('/tests/:id', ctrlTests.remove)
router.put('/tests/:id', ctrlTests.update)

//admin
router.get('/backup', ctrlAdmin.getBDBackup)

router.get('/reports/:query', ctrlAdmin.downloadCSV)

module.exports = router
