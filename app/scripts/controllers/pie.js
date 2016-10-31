'use strict';
app.controller('PieChartController', ['$rootScope', '$scope', '$http', '$timeout', 'Pie', function($rootScope, $scope, $http, $timeout, Pie) {
    var loaded = false;

    $timeout(function() {
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