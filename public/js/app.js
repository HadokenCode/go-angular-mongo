(function() {

    "use strict";

    angular.module('myapp', [
        "ui.router"
    ]);

}());



(function() {
    "use strict";
    angular.module("myapp").factory("mainFactory", [
        "$http", "$q", mainFactory
    ]);

    function mainFactory($http, $q) {

        return {
            getArticles: function(){
                var d = $q.defer();

                $http.get("/api/articles")
                    .success(d.resolve)
                    .error(d.reject);

                //alert("factory");
                //console.log(d.promise);
                return d.promise;

            },

            createArticle: function(payload){
                var d = $q.defer();

                $http.post("/api/new/articles/:payload", payload)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            updateArticle: function(payload){
                var d = $q.defer();

                $http.post("/api/update/articles/:payload", payload)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            deleteArticle: function(payload){
                var d = $q.defer();

                $http.post("/api/delete/articles/:payload", payload)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            getRepoInfo: function(){
                var d = $q.defer();

                $http.get("https://api.github.com/repos/nenjotsu/GoGAM")
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            }
        }
    }

})();

(function() {
    "use strict";
    angular.module("myapp").controller("mainController", [
        "$scope", "mainFactory", mainController
    ]);

    function mainController($scope, factory) {

        /* jshint validthis: true */
        var vm = this;
        vm.transaction = 0;
        factory.getRepoInfo().then(function(res){
            vm.repoInfo = res;
        });

        vm.getArticles = function(){
            factory.getArticles().then(function(res){
                vm.articleList = [].concat(res);
                angular.element('#myModal').modal('hide');
            },function(error){
                console.log(error);
            });
        };

        vm.payload = {
            body: "",
            title: ""
        };

        vm.createArticle = function(payload){
            factory.createArticle(payload).then(function(res){
                vm.getArticles();
            },function(error){
                console.log(error);
            });
        };

        vm.editArticle = function(payload){
            vm.curr = payload || vm.payload;
            vm.transaction = (payload ? 1 : 0);
        };

        vm.saveArticle = function(payload){
            factory.updateArticle(payload).then(function(res){
                vm.getArticles();
            },function(error){
                console.log(error);
            });
        };

        vm.deleteArticle = function(payload){
            factory.deleteArticle(payload).then(function(res){
                vm.getArticles();
            },function(error){
                console.log(error);
            });
        };

        vm.getArticles();
    }

})();

(function() {
    "use strict";
    angular.module("myapp").factory("loginFactory", [
        "$http", "$q", loginFactory
    ]);

    function loginFactory($http, $q) {

        return {
            getArticles: function(){
                var d = $q.defer();

                $http.get("/api/articles")
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            }
        }
    }

})();

(function() {
    "use strict";
    angular.module("myapp").controller("loginController", [
        "$scope", "loginFactory", loginController
    ]);

    function loginController($scope, factory) {

        /* jshint validthis: true */
        var vm = this;
        vm.message = "This is a sample for another angular ui-route";

        factory.getArticles().then(function(res){
        	vm.articleList = [].concat(res);
        },function(error){
        	console.log(error);
        });
    }

})();



(function() {
    "use strict";
    angular.module("myapp").config([
        "$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",

        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            $urlRouterProvider.otherwise("/public/err404");

            $stateProvider
                .state("home", {
                    url: "/public/",
                    controller: "mainController",
                    controllerAs: "vm",
                    templateUrl: "public/html/home/home.html"
                })
                .state("login", {
                    url: "/public/login",
                    controller: "loginController",
                    controllerAs: "vm",
                    templateUrl: "public/html/login/login.html"
                })

            .state("notfound", {
                url: "/public/err404",
                templateUrl: "public/html/404.html"
            })
            ;

            // use the HTML5 History API
            $locationProvider.html5Mode(true);
        }
    ]);

}());

(function() {
    "use strict";
    angular.module("myapp").run([
        "$rootScope", "$state", "$stateParams", "$templateCache",

        function($rootScope, $state, $stateParams, $templateCache) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]);

}());

