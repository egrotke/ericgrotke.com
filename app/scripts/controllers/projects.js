'use strict';
app.controller('ProjectsController', ['$scope',  'SiteData', function($scope, SiteData) {
   
    $scope.projectsData = {};
    SiteData.projects()
        .then(function(data) {
            $scope.projectsData.sites = data.data;
        }, function(data, status) {
            console.log('Error: didnnt get JSON' + data + status);
        });
    $scope.projectPics = function() {
        var urls = [];
        $('#pics img').each(function(i) {
            urls[i] = $(this).attr('src');
        });
        return urls;
    };

    $scope.getImage = function(site, i) {
        return $scope.projectPics()[i] ? $scope.projectPics()[i] : (site.thumbnail ? site.thumbnail : '');
    };

}]);