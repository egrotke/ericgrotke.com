'use strict';
/*jshint bitwise: false*/
/*jshint loopfunc: true*/
var app = angular.module('egApp', ['ngRoute']);

// configure our routes
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/home', {
        templateUrl: 'pages/home.html',
        reloadOnSearch: false
    })

    // route for the about page
    .when('/about', {
        templateUrl: 'pages/about.html',
        reloadOnSearch: false
    })

    // route for the contact page
    .when('/contact', {
        templateUrl: 'pages/contact.html',
        // controller: 'LettersController',
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
        reloadOnSearch: false
    });

}]);

app.controller('LettersController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
    $scope.myData = {};
    $scope.timeouts = [];

    var doStuffWithData = function() {
        $scope.template = $scope.myData.words[0];
        $scope.myData.words.doClick = function(index, item) {
            $scope.action = item.action;

            if ($scope.action === 'drawGraph') {
                $rootScope.$emit('loadStream');
            }
            if ($scope.action === 'piechart') {
                $rootScope.$emit('loadPie');
            }

            $rootScope.emailSelected = ($scope.action === 'email') ? 'selected' : '';
            $rootScope.linkedInSelected = ($scope.action === 'linkedin') ? 'selected' : '';
            $rootScope.githubSelected = ($scope.action === 'github') ? 'selected' : '';
            $rootScope.resumeSelected = ($scope.action === 'resume') ? 'selected' : '';
        };


        $scope.myData.words.doHover = function(index, item, event) {
            event.stopPropagation();
            if ($scope.action === 'drawGraph') {
                $rootScope.$emit('updateStream');
            }
            if ($scope.action === 'piechart') {
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
            clearTimeout($scope.timeouts[key]);
            if (key >= start && key < finish) {
                $scope.timeouts[key] = setTimeout(function() {
                    a.addClass('hover');
                }, 150 * (key - start) + 200);
            }
        });

    };

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

    $scope.getClass = function(path) {
        if ($location.path()) {
            return ($location.path().substr(1, path.length) === path) ? '' : 'selected';
        } else if (path === 'home') {
            return 'selected';
        }

    };

    $rootScope.getScrolled = function() {
        return $rootScope.scrolled;
    };


    window.onscroll = function() {
        if ($rootScope.scrolled !== 'scrolled' && document.body.scrollTop > 200) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = 'scrolled';
            });
            (window.innerWidth < 768) ? flipBoxes(0, 0) : flipBoxes(0, 12);
        } else if ($rootScope.scrolled !== 'midscroll' && document.body.scrollTop > 20 && document.body.scrollTop < 200) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = 'midscroll';
            });
            (window.innerWidth < 768) ? flipBoxes(0, 0) : flipBoxes(0, 12);
        } else if ($rootScope.scrolled && document.body.scrollTop < 20) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = '';
            });
            flipBoxes(0, 0);
        } 
    };

    $scope.getFlipperPos = function() {
        if ($rootScope.scrolled) {
            return $rootScope.scrolled;
        } else {
            return ($location.path() === '/home' || $location.path() === '') ? '' : 'subPage';
        }
    };
    $scope.$on('$routeChangeSuccess', function(scope, next) {
        $scope.transitionState = 'active';

        if (next && next.loadedTemplateUrl !== 'pages/streamgraph.html') {
            d3.select('svg').remove();
            $scope.streamData = 0;
        }
        if (next && next.loadedTemplateUrl === 'pages/home.html') {
            flipBoxes(0, 0);
        } else if (next && next.loadedTemplateUrl === 'pages/contact.html') {
            flipBoxes(0, 4);
        } else if (next && next.loadedTemplateUrl === 'pages/about.html') {
            flipBoxes(0, 0);
        } else if (next && next.loadedTemplateUrl === 'pages/projects.html') {
            flipBoxes(4, 12);
        }
    });

    $scope.projectPics = function() {
        var urls = [];
        $('#pics img').each(function(i) {
          urls[i] = $(this).attr('src');
        });
        return urls;
    };

    $scope.getImage = function(site, i) {
        return  $scope.projectPics()[i] ? $scope.projectPics()[i] : (site.thumbnail ? site.thumbnail : '');
    };


}]);



app.controller('PieChartController', ['$rootScope', '$scope', '$http', 'Pie', function($rootScope, $scope, $http, Pie) {
    var loaded = false;

    setTimeout(function() {
        loaded = Pie.newChart(Math.random() * 9 + 1);
    }, 1);

    $rootScope.$on('loadPie', function() {
        loaded = Pie.newChart(Math.random() * 9 + 1);
    });

    $rootScope.$on('updatePie', function() {
        if (loaded) {
            Pie.update();
        }
    });
}]);


app.controller('StreamController', ['$rootScope', '$scope', function($rootScope, $scope) {
   var loadGraph = function() {
        var numberOfSeries = Math.floor(Math.random() * 10) + 4;

        $scope.numberOfDataPoint = Math.floor(Math.random() * 51) + 5;

        d3.select('svg').remove();

        $scope.streamData = [];
        for (var i = 0; i < numberOfSeries; ++i) {
            $scope.streamData.push(d3.range($scope.numberOfDataPoint).map(function(i) {
                return { x: i, y: (i === 0 || i === $scope.numberOfDataPoint - 1) ? 0 : $scope.randomData() };
            }));
        }
        $scope.chart = streamgraph()
            .x(d3.scale.linear().domain([0, $scope.numberOfDataPoint - 1]))
            .y(d3.scale.linear().domain([0, 65]))
            .colors(d3.scale.linear().range(['#aad', '#556']));

        $scope.streamData.forEach(function(series) {
            $scope.chart.addSeries(series);
        });
        $scope.chart.render();

            
        setTimeout(function() {updateGraph();}, 0.40);
        var x = 0;
        var intervalID = setInterval(function() {

            updateGraph();

            if (++x === 2) {
                window.clearInterval(intervalID);
            }
        }, 400);

    };

    var updateGraph = function() {
        for (var i = 0; i < $scope.streamData.length; ++i) {
            var series = $scope.streamData[i];
            series.length = 0;
            for (var j = 0; j < $scope.numberOfDataPoint; ++j) {
                series.push({ x: j, y: (j === 0 || j === $scope.numberOfDataPoint - 1) ? 0 : $scope.randomData() });
            }
        }
        $scope.chart.render();
    };

    $scope.$on('$routeChangeSuccess', function() {
        $scope.transitionState = 'active';

        $scope.streamData = 0;
        loadGraph();
    });

    $rootScope.$on('loadStream', function() {
        loadGraph();
    });

    $rootScope.$on('updateStream', function() {
        if ($scope.streamData) {
            updateGraph();
        }
    });
    $scope.randomData = function() {
        return Math.random() * 6;
    };

 
}]);

