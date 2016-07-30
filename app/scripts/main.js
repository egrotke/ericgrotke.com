'use strict';
/*jshint bitwise: false*/
var app = angular.module('egApp', ['ngRoute']);

// configure our routes
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider

	// route for the home page
	.when('/home', {
		templateUrl: 'pages/home.html',
		controller: 'LettersController',
                reloadOnSearch: false
	})

	// route for the about page
	.when('/about', {
		templateUrl: 'pages/about.html',
		controller: 'LettersController',
        reloadOnSearch: false
	})

	// route for the contact page
	.when('/contact', {
		templateUrl: 'pages/contact.html',
		controller: 'LettersController',
        reloadOnSearch: false
	})

	// route for the streamgraph page
	.when('/streamgraph', {
		templateUrl: 'pages/streamgraph.html',
		controller: 'StreamController',
        reloadOnSearch: false
	})
	// route for the piechart page
	.when('/piechart', {
		templateUrl: 'pages/piechart.html',
		controller: 'PieChartController',
        reloadOnSearch: false
	})

	// route for the projects page
	.when('/projects', {
		templateUrl: 'pages/projects.html',
		controller: 'LettersController',
        reloadOnSearch: false
	})

	// route for the tags page
	.when('/tags', {
		templateUrl: 'pages/tags.html',
		controller: 'TagsController',
        reloadOnSearch: false
	})

	// route for the stylesheet page
	.when('/stylesheet', {
		templateUrl: 'pages/stylesheet.html',
		// controller: 'SheetController',
        reloadOnSearch: false
	});

}]);

app.controller('LettersController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
	$scope.myData = {};
	$http.get('json/eg.json')
		.then(function(data) {
			$scope.myData.words = data.data;
			doStuffWithData();
		}, function(data, status) {
			console.log('Error: didnnt get JSON' + data + status);
		});

	$scope.projectsData = {};
	$http.get('json/projects.json')
		.then(function(data) {
			$scope.projectsData.sites = data.data;
		}, function(data, status) {
			console.log('Error: didnnt get JSON' + data + status);
		});

	$scope.$on('$routeChangeSuccess', function(scope, next) {
		$scope.transitionState = 'active';
		$('#' + $scope.action).addClass('selected');

		if (next && next.loadedTemplateUrl !== 'pages/streamgraph.html') {
			d3.select('svg').remove();
			$scope.streamData = 0;
		}

		if (next && next.loadedTemplateUrl === 'pages/home.html') {
			homeLoaded();
		} else if (next && next.loadedTemplateUrl === 'pages/contact.html') {
			contactLoaded();
		} else if (next && next.loadedTemplateUrl === 'pages/about.html') {
			aboutLoaded();
		} else if (next && next.loadedTemplateUrl === 'pages/projects.html') {
			projectsLoaded();
		} 

	});

	$scope.getImage = function(site){
	  	return site.thumbnail ? site.thumbnail : '';
	};

	var homeLoaded = function() {
		flipBoxes(0, 0);
		$('#flippers').removeClass('header');
		$('.nav li').removeClass('active');
		$('.nav li.home').addClass('active');
	};

	var projectsLoaded = function() {
		flipBoxes(4, 12);
		$('#flippers').addClass('header');
		$('.nav li').removeClass('active');
		$('.nav li.projects').addClass('active');
	};
	var contactLoaded = function() {
		flipBoxes(0, 4);
		$('#flippers').addClass('header');
		$('.nav li').removeClass('active');
		$('.nav li.contact').addClass('active');
	};
	var aboutLoaded = function() {
		flipBoxes(0, 0);
		$('#flippers').addClass('header');
		$('.nav li').removeClass('active');
		$('.nav li.about').addClass('active');
	};



	var doStuffWithData = function() {
		$scope.template = $scope.myData.words[0];
		$scope.myData.words.doClick = function(index, item, event) {
			$scope.action = item.action;

			if($scope.action === 'drawGraph'){
				$rootScope.$emit('loadStream');
			} 
			if($scope.action === 'piechart'){
				$rootScope.$emit('loadPie');
			} 
			if ($scope.action === 'email' || $scope.action === 'linkedin' ||
			 $scope.action === 'github' || $scope.action === 'resume'){
				$('.card-block').removeClass('selected');
				$('#' + $scope.action).addClass('selected');
			}
		};


		$scope.myData.words.doHover = function(index, item, event) {
			event.stopPropagation();
			if($scope.action === 'drawGraph'){
				$rootScope.$emit('updateStream');
			} 
			if($scope.action === 'piechart'){
				$rootScope.$emit('updatePie');
			} 
		};
	};

	var flipBoxes = function(start, finish) {
		angular.forEach(angular.element('.flip-container'), function(value, key) {
			var a = angular.element(value);
			if (a.hasClass('hover')) {
				a.removeClass('hover');
			}
			if (key >= start && key < finish) {
				setTimeout(function() {
					a.addClass('hover');
				}, 40 * (key - start));
			}
		});
	};
}]);



app.controller('PieChartController', ['$rootScope', '$scope', '$http', 'PieService', function($rootScope, $scope, $http, PieService) {
    var loaded = false;

    setTimeout(function() {
	    loaded = PieService.newChart(Math.random() * 9 + 1);
	},1);

    $rootScope.$on('loadPie', function(event, args) {
	    // setTimeout(function() {
		    loaded = PieService.newChart(Math.random() * 9 + 1);
		// },1);
	});

    $rootScope.$on('updatePie', function(event, args) {
   		if(loaded){
			PieService.update();
		}
	});
}]);


app.controller('StreamController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

	$scope.$on('$routeChangeSuccess', function(scope, next) {
		$scope.transitionState = 'active';
		// $('#' + $scope.action).addClass('selected');

		$scope.streamData = 0;
		loadGraph();
	});

    $rootScope.$on('loadStream', function(event, args) {
		loadGraph();
	});

    $rootScope.$on('updateStream', function(event, args) {
   		if($scope.streamData){
			updateGraph();
		}
	});

	var loadGraph = function() {
    	var numberOfSeries = Math.floor(Math.random()*8) + 4;
    		
    	$scope.numberOfDataPoint = Math.floor(Math.random()*51) + 5;

		d3.select('svg').remove();

        $scope.streamData = [];
		for (var i = 0; i < numberOfSeries; ++i)
		    $scope.streamData.push(d3.range($scope.numberOfDataPoint).map(function (i) {
		        return {x: i, y: (i===0 || i === $scope.numberOfDataPoint-1) ? 0 : randomData()};
		    }));
		
		$scope.chart = streamgraph()
		        .x(d3.scale.linear().domain([0, $scope.numberOfDataPoint - 1]))
		        .y(d3.scale.linear().domain([0, 65]))
		        .colors(d3.scale.linear().range(['#aad', '#556']));
		
		$scope.streamData.forEach(function (series) {
		    $scope.chart.addSeries(series);
		});
		$scope.chart.render();
		// setTimeout(function() {$scope.$apply()},1);
		
    }

	var updateGraph = function() {
	    for (var i = 0; i < $scope.streamData.length; ++i) {
	        var series = $scope.streamData[i];
	        series.length = 0;
	        for (var j = 0; j < $scope.numberOfDataPoint; ++j)
	            series.push({x: j, y: (j===0 || j === $scope.numberOfDataPoint-1) ? 0 : randomData()});
	    }
	    $scope.chart.render();
	}
}]);

app.controller('TagsController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
	var svgCode = '';
	
	$http.get('json/tags.json')
		.then(function(data) {
			$scope.tagData = data.data;
			// doStuffWithData();
		}, function(data, status) {
			console.log('Error: didnnt get JSON' + data + status);
	});

	function letterOBJ(key, value) {
	   this.key = key;
	   this.value = value;
	}

	function buildWordOBJ(str) {
        $rootScope.wordOBJ = [];

        $('.words svg').remove();

		str.split('').forEach(function(entry, index) {
		    $rootScope.wordOBJ.push(new LetterOBJ(index, entry));
		});
	}

	buildWordOBJ('var add = (function () { var counter = 0; return function () {return counter += 1;}})(); add();');

	$scope.changeWord = function(tag) {
		var word = (tag.description) ? tag.description : tag.name;
		buildWordOBJ( word );
	}

	$scope.$watch(function() { return $rootScope.wordOBJ; }, function(newVal, oldVal) {

	    if (newVal && newVal.length !== oldVal.length) {
	      // element.html(newVal);
	      // $compile(element)(scope);
	    }
	  });

}]);

app.directive('letter', ['$compile', '$http', '$templateCache', '$rootScope', function($compile, $http, $templateCache, $rootScope) {

        var getTemplate = function(letterCode) {
            var templateLoader, templateUrl,
            baseUrl = 'svg/',
            letters = 'abcdefghijklmnopqrstuvwxyz1234567890(){}=+;:';
            letterCode = letterCode.toLowerCase();

            if (letters.indexOf(letterCode) > -1){
	            templateUrl = baseUrl + letterCode + '.svg'; 
	        } else {
	            templateUrl = baseUrl + 'blank.svg'; 
	        }

            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;
        }

        var linker = function(scope, element, attrs) {
            var loader =  getTemplate(scope.myletter.value);

            var promise = loader.success(function(html) {
                element.html(html);
            }).then(function (response) {
                element.replaceWith($compile(element.html())(scope));
            });

        }

        return {
            restrict: 'E',
            scope: {
                myletter:'='
            },
            link: linker
        };
    }]);

