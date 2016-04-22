/**
 * Created by mmontaque on 7/16/2015.
 */

(function(angular){

// Gets the initialized application
    var app = angular.module(APP_NAME);

    app.config(['$routeProvider', '$locationProvider', '$provide',
        function($routeProvider, $locationProvider, $provide){

            // Decorate with allSettled Function
            $provide.decorator('$q', ['$delegate', function ($delegate) {
                var $q = $delegate;

                $q.allSettled = $q.allSettled || function allSettled(promises) {
                        // Implementation of allSettled function from Kris Kowal's Q:
                        // https://github.com/kriskowal/q/wiki/API-Reference#promiseallsettled

                        var wrapped = angular.isArray(promises) ? [] : {};

                        angular.forEach(promises, function(promise, key) {
                            if (!wrapped.hasOwnProperty(key)) {
                                wrapped[key] = wrap(promise);
                            }
                        });

                        return $q.all(wrapped);

                        function wrap(promise) {
                            return $q.when(promise)
                                .then(function (value) {
                                    return { state: 'fulfilled', value: value };
                                }, function (reason) {
                                    return { state: 'rejected', reason: reason };
                                });
                        }
                    };

                return $q;
            }]);

            // Define the routes for the application
            $routeProvider
                .otherwise({redirectTo:'/home'})

        }]);


})(angular);
