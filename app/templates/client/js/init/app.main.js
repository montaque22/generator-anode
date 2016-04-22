/**
 * Created by mmontaque on 7/16/2015.
 */
APP_NAME="<%= name %>";



(function(angular){

    angular.module('services',[]);
    angular.module('controllers',[]);
    angular.module('directives',[]);
    angular.module('factories',[]);
    angular.module('filters', []);

    // Initializes (Sets) the application
    var app = angular.module(APP_NAME,[
        'services',
        'factories',
        'directives',
        'controllers',
        'ngRoute',
        'filters'
    ]);



    // Code you want to run after Angular Initializes
    app.run(['$rootScope', '$window','$q', function($rootScope, $window, $q){
        /**
         * Init Code Here
         */

    }]);


    angular.element(document).ready(function() {
        var html = document.getElementsByTagName('html');
        angular.bootstrap(angular.element(html), [APP_NAME]);
    });


})(angular);
