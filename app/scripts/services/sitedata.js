'use strict';
app.factory("SiteData", ['$http', function SiteDataFactory($http) {
    return {
        letters: function() {
            return $http.get('json/eg.json');
        },
        projects: function() {
            return $http.get('json/projects.json');
        },
        tags: function() {
            return $http.get('json/tags.json');
        }
    };
}]);
