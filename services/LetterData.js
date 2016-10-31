app.factory("LetterData", function LetterDataFactory() {
	return {
		all: function() {
		   return $http.get('json/eg.json');
		}
	}
});