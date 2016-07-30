angular.module('egApp', []).factory('d3Service', [
  function(){

    var d3;
    d3 = window.d3;

    // returning our service so it can be used
    return d3;
}]);