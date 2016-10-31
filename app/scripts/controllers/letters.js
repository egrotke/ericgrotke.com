'use strict';

app.controller('LettersController', ['$rootScope', '$scope', '$location', '$timeout', 'SiteData', function($rootScope, $scope, $location, $timeout, SiteData) {
    $scope.timeouts = [];
    $scope.myData = {};
    SiteData.letters()
        .then(function(data) {
            $scope.myData.words = data.data;
            $scope.addLetterEvents();
        }, function(data, status) {
            console.log('Error: didnnt get JSON' + data + status);
        });

    $scope.addLetterEvents = function() {
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
            $timeout.cancel($scope.timeouts[key]);
            if (key >= start && key < finish) {
                $scope.timeouts[key] = $timeout(function() {
                    a.addClass('hover');
                }, 150 * (key - start) + 200);
            }
        });
    };

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
        var endFlip = 12;
        if ($rootScope.scrolled !== 'scrolled' && document.body.scrollTop > 200) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = 'scrolled';
            });
            if (window.innerWidth < 768) { endFlip = 0; }
        } else if ($rootScope.scrolled !== 'midscroll' && document.body.scrollTop > 20 && document.body.scrollTop < 200) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = 'midscroll';
            });
            if (window.innerWidth < 768) { endFlip = 0; }
        } else if ($rootScope.scrolled && document.body.scrollTop < 20) {
            $rootScope.$apply(function() {
                $rootScope.scrolled = '';
            });
            endFlip = 0;
        }
        flipBoxes(0, endFlip);
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
}]);
