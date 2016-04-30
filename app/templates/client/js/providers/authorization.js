/**
 * Created by montaque22 on 4/12/15.
 */
angular
    .module('providers')
    .provider('authorization',
    [function() {
        'use strict';

        var authData = true;

        this.isAuthorized = function(){
            return !!authData
        };


        this.$get = [function() {
            return {

            }
    }];
}]);