/**
 * Created by montaque22 on 4/12/15.
 */
angular
    .module('directives')
    .directive('<%= name %>',
        [
            '$rootScope',
            function($rootScope) {
            'use strict';
            return {
                restrict: 'AE',
                templateUrl:'<%= url %>',
                scope:{},
                link:function(scope, element, attr){
                    var $self = element;
                }
            };
        }]);