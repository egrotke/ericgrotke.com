'use strict';
/*jshint bitwise: false*/
/*jshint loopfunc: true*/
var app = angular.module('egApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/home', {
        templateUrl: 'pages/home.html',
        reloadOnSearch: false
    })
    .when('/about', {
        templateUrl: 'pages/about.html',
        reloadOnSearch: false
    })
    .when('/contact', {
        templateUrl: 'pages/contact.html',
        // controller: 'LettersController',
        reloadOnSearch: false
    })
    .when('/streamgraph', {
            templateUrl: 'pages/streamgraph.html',
            controller: 'StreamController',
            reloadOnSearch: false
    })
    .when('/piechart', {
            templateUrl: 'pages/piechart.html',
            controller: 'PieChartController',
            reloadOnSearch: false
    })
    .when('/projects', {
        templateUrl: 'pages/projects.html',
        reloadOnSearch: false
    })
    .when('/tags', {
        templateUrl: 'pages/tags.html',
        controller: 'TagsController',
        reloadOnSearch: false
    })
    .when('/stylesheet', {
        templateUrl: 'pages/stylesheet.html',
        reloadOnSearch: false
    });
}]);







