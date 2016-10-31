'use strict';

app.controller('StreamController', ['$rootScope', '$scope', '$timeout',  function($rootScope, $scope, $timeout) {
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


        $timeout(function() { updateGraph(); }, 0.40);
        var x = 0;
        var intervalID = setInterval(function() {

            updateGraph();

            if (++x === 1) {
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