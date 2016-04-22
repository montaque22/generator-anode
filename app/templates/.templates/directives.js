/**
 * Created by montaque22 on 4/12/15.
 */
angular
    .module('directives')
    .directive('<%= name %>',
    [function() {
        'use strict';
        return {
            restrict: 'AE',
            templateUrl:'<%= url %>',
            controller:function($scope){},
            scope:{},
            link:function(scope, element, attr){
            var $self = $(element);
        }
    };
}]);