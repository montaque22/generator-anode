/**
 * Created by montaque22 on 4/12/15.
 */
'use strict';
angular
    .module('controllers')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('plip', {
            templateUrl: './client/views/pages/kitten/kitten.html',
            controller: 'Kitten'
        });
    }])
    .controller('Kitten', ['$scope',
        function(scope) {

        }
    ]);