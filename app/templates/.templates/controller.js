/**
 * Created by montaque22 on 4/12/15.
 */
'use strict';
angular
    .module('controllers')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('<%= route%>', {
            templateUrl: '<%= url%>',
            controller: '<%= name%>'
        });
    }])
    .controller('<%= name%>', ['$scope',
        function(scope) {

        }
    ]);