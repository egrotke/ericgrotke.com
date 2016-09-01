'use strict';


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

    buildWordOBJ('var add = (function () {&br;&tb;var counter = 0;&br;&tb;return function () {&br; &tb;&tb;return counter += 1;&tb;} })(); &br;&br; add();');

    $scope.changeWord = function(tag) {
        buildWordOBJ((tag.description) ? tag.description : tag.name);
    };

    // $scope.$watch(function() {
    //     return $rootScope.wordOBJ;
    // }, function(newVal, oldVal) {

    //     if (newVal && newVal.length !== oldVal.length) {
    //         // element.html(newVal);
    //         // $compile(element)(scope);
    //     }
    // });

    

}]);

app.directive('letter', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {
    var specialLetter = '';

    var getTemplate = function(letterCode) {
        var templateLoader, templateUrl = 'svg/',
            letters = 'abcdefghijklmnopqrstuvwxyz1234567890(){}=+;<>-';
        letterCode = letterCode.toLowerCase();

        if (specialLetter){
            specialLetter += letterCode;
            if (letterCode === ';'){

                if (specialLetter === '&br;'){
                    templateUrl += 'break.svg';
                } else if (specialLetter === '&tb;'){
                    templateUrl += 'tab.svg';
                } else {//default
                    templateUrl += 'break.svg';
                }
                specialLetter = '';
            } else{
                templateUrl += 'nada.svg';
            }
        } else if (letters.indexOf(letterCode) > -1) {
            templateUrl += letterCode + '.svg';
        } else if (letterCode === '/'){
            templateUrl += 'slash.svg';
        } else if (letterCode === ':'){
            templateUrl += 'colon.svg';
        } else if (letterCode === '&'){
            specialLetter += letterCode;
            templateUrl += 'nada.svg';
        } else {
            templateUrl += 'blank.svg';
        }

        templateLoader = $http.get(templateUrl, { cache: $templateCache });

        return templateLoader;
    };

    var linker = function(scope, element) {
        var loader = getTemplate(scope.myletter.value);

        loader.success(function(html) {
            element.html(html);
        }).then(function() {
            element.replaceWith($compile(element.html())(scope));
        });
    };

    return {
        // restrict: 'E',
        scope: {
            myletter: '='
        },
        link: linker
    };
}]);