/**
 * Created by mmontaque on 4/6/16.
 */
angular
    .module('filters')
    .filter('<%= name %>', ["$filter", function ($filter) {
        return function(){

        };
    }]);