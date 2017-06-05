const angular = require('angular');
const _ = require('lodash');
window._ = _;
require("./mixins")(_);

require("normalize.css");
require("./styles/styles.scss");


require("angular-ui-router");
require("angular-animate");
require("angular-aria");
require("angular-cookies");
require("restangular");
require("angular-md5");

require("angular-material");
require("angular-material/angular-material.css");

require("angular-material-data-table/dist/md-data-table.min.js");
require("angular-material-data-table/dist/md-data-table.min.css");

require("v-accordion");
require("v-accordion/dist/v-accordion.css");

require("./vendor/ng-mask/ngMask.min");

//require("chart.js/dist/Chart.min.js")
require("angular-chart.js/dist/angular-chart.js");
require("angular-sanitize");
require("ng-csv");
require("angular-csv-import");


require("./components/backend");
require("./components/root");
require("./components/auth");
require("./components/home");
require("./components/common");
require("./components/admin");
require("./components/about");
require("./components/properties");
require("./components/analyse");
require("./components/mentoring");
require("./components/personal-info");
require("./components/tests");

const App = angular.module('app',
	[
		"ui.router",
		"ngMaterial",
		"vAccordion",
		"ngAnimate",
		"ngSanitize",
		"ngCsv",
		"ngCsvImport",
		"md.data.table",
		"ngMask",
		"ngCookies",
		"app.backend",
		"app.common",
		"app.root",
		"app.auth",
		"app.home",
		"app.admin",
		"app.about",
		"app.properties",
		"app.analyse",
		"app.mentoring",
		"app.personal-info",
		"app.tests",
		"chart.js"
	]);

App.config(function ($stateProvider, $locationProvider, $urlRouterProvider, flashAlertProvider, $mdDateLocaleProvider, $mdThemingProvider) {
	console.log(228)
	flashAlertProvider.setAlertTime(2000);
	$urlRouterProvider.otherwise('/');
	/*$locationProvider.html5Mode(true);*/

		$mdThemingProvider.definePalette('psychopasspallette', {
		  '50': 'e9e7ed',
		  '100': 'c8c3d1',
		  '200': 'a39bb2',
		  '300': '7e7393',
		  '400': '63557c',
		  '500': '473765',
		  '600': '40315d',
		  '700': '372a53',
		  '800': '2f2349',
		  '900': '201637',
		  'A100': '9d78ff',
		  'A200': '7845ff',
		  'A400': '5312ff',
		  'A700': '4400f7',
		  'contrastDefaultColor': 'light',
		  'contrastDarkColors': [
		    '50',
		    '100',
		    '200',
		    'A100'
		  ],
		  'contrastLightColors': [
		    '300',
		    '400',
		    '500',
		    '600',
		    '700',
		    '800',
		    '900',
		    'A200',
		    'A400',
		    'A700'
		  ]
		});

		$mdThemingProvider.definePalette('salat', {
		  '50': 'e8fae9',
		  '100': 'c7f4c8',
		  '200': 'a1eca4',
		  '300': '7be47f',
		  '400': '5fdf63',
		  '500': '43d948',
		  '600': '3dd541',
		  '700': '34cf38',
		  '800': '2cca30',
		  '900': '1ec021',
		  'A100': 'f7fff7',
		  'A200': '43d948',
		  'A400': '42d944',
		  'A700': '43d948',
		  'contrastDefaultColor': 'light',
		  'contrastDarkColors': [
		    '50',
		    '100',
		    '200',
		    '300',
		    '400',
		    '500',
		    '600',
		    '700',
		    '800',
		    'A100',
		    'A200',
		    'A400',
		    'A700'
		  ],
		  'contrastLightColors': [
		    '900'
		  ]
		});

		$mdThemingProvider.theme('default')
		.primaryPalette('psychopasspallette')
		.warnPalette('red')
		.accentPalette('salat');
	

    $mdDateLocaleProvider.months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    $mdDateLocaleProvider.shortMonths = ['янв', 'февр', 'мрт', 'апр', 'май', 'июн', 'июл', 'авг', 'сент', 'окт', 'нбр', 'дкбр'];
    $mdDateLocaleProvider.days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    $mdDateLocaleProvider.shortDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    $mdDateLocaleProvider.msgCalendar = 'Календарь';
});





App.run(($rootScope, $state, $document, Sessions, Auth)=>{

	$rootScope.appName = "Психологический модуль программы НОП Полет";
	$document[0].title = $rootScope.appName;
	$rootScope.isAuth = Auth.isAuth();
/*	if(!$rootScope.isAuth && _.includes($state.current.name,"home")){
		$state.transitionTo('auth.signIn')
	}*/
	
})

/*####################*/
/*

_.mixin({isUpdated})
_.mixin({initUpdating})

function isUpdated(obj) {
	console.log(obj)
	let result = false;
		_.forIn(obj, (val, key) => {
			if((key !== "oldVal" && key !== "$$hashKey" && !_.isObject(obj[key]))){
				if(obj.oldVal[key] !== val || obj.oldVal[key] === undefined) {
				result = true;
				initUpdating(obj)
			}
		}
	});

	return result
}

function initUpdating(obj){
	obj.oldVal = _.clone(obj);
}*/
