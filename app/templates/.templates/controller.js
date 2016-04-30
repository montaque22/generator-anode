/**
 * Created by montaque22 on 4/12/15.
 */
'use strict';
angular
    .module(APP_NAME)
    .config(['$routeProvider', 'authorizationProvider', function($routeProvider, authorizationProvider) {
        $routeProvider.when('/<%= route%>', {
            templateUrl : '<%= url%>',
            controller  : '<%= name%>',
            resolve     : authorizationProvider.isAuthorized()
        });
    }])
    .controller('<%= name%>', ['$scope',
        function(scope) {

        }
    ]);