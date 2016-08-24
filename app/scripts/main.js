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
    }


    window.onscroll = function(e) {
        if ($rootScope.scrolled !== 'scrolled' && document.body.scrollTop > 200) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = 'scrolled';
            });
            flipBoxes(0, 12);
        } else if ($rootScope.scrolled !== 'midscroll' && document.body.scrollTop > 20 && document.body.scrollTop < 200) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = 'midscroll';
            });
            flipBoxes(0, 12);
        } else if ($rootScope.scrolled && document.body.scrollTop < 20) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = '';
            });
            flipBoxes(0, 0);
        } 
    }

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

    $scope.getImage = function(site) {
        return site.thumbnail ? site.thumbnail : '';
    };

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
            if (key >= start && key < finish) {
                setTimeout(function() {
                    a.addClass('hover');
                }, 150 * (key - start));
            }
        });
    };

}]);



app.controller('PieChartController', ['$rootScope', '$scope', '$http', 'PieService', function($rootScope, $scope, $http, PieService) {
    var loaded = false;

    setTimeout(function() {
        loaded = PieService.newChart(Math.random() * 9 + 1);
    }, 1);

    $rootScope.$on('loadPie', function() {
        loaded = PieService.newChart(Math.random() * 9 + 1);
    });

    $rootScope.$on('updatePie', function() {
        if (loaded) {
            PieService.update();
        }
    });
}]);


app.controller('StreamController', ['$rootScope', '$scope', function($rootScope, $scope) {

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

            
        setTimeout(function() {updateGraph();}, .40);
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
}]);

app.controller('TagsController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $http.get('json/tags.json')
        .then(function(data) {
            $scope.tagData = data.data;
        }, function(data, status) {
            console.log('Error: didnnt get JSON' + data + status);
        });

    function LetterOBJ(key, value) {
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
        buildWordOBJ(word);
    };

    $scope.$watch(function() {
        return $rootScope.wordOBJ;
    }, function(newVal, oldVal) {

        if (newVal && newVal.length !== oldVal.length) {
            // element.html(newVal);
            // $compile(element)(scope);
        }
    });

}]);

app.directive('letter', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

    var getTemplate = function(letterCode) {
        var templateLoader, templateUrl = 'svg/',
            letters = 'abcdefghijklmnopqrstuvwxyz1234567890(){}=+;<>-';
        letterCode = letterCode.toLowerCase();

        if (letters.indexOf(letterCode) > -1) {
            templateUrl += letterCode + '.svg';
        } else if (letterCode === '/'){
            templateUrl += 'slash.svg';
        } else if (letterCode === ':'){
            templateUrl += 'colon.svg';
        } else {
            templateUrl += 'blank.svg';
        }

        templateLoader = $http.get(templateUrl, { cache: $templateCache });

        return templateLoader;
    };

    var linker = function(scope, element) {
        var loader = getTemplate(scope.myletter.value);

        var promise = loader.success(function(html) {
            element.html(html);
        }).then(function() {
            element.replaceWith($compile(element.html())(scope));
        });
    };

    return {
        restrict: 'E',
        scope: {
            myletter: '='
        },
        link: linker
    };
}]);
