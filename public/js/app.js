(function() {

    "use strict";

    angular.module('myapp', [
        "ui.router"
        ,"LocalStorageModule"
    ]);

}());



(function() {
    "use strict";
    angular.module("myapp").factory("loginFactory", [
        "$http", "$q", "$window", "localStorageService", "$location", loginFactory
    ]);

    function loginFactory($http, $q, $window, lss, $location) {

        var x = {
            token: undefined
        };

        var c = {
            header: {
                'Content-Type': 'application/json'
            }
        };

        return {

            config: function(token) {
                return {
                    headers:{

                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    
                    }
                };
            },
            login: function(payload){
                var d = $q.defer();

                $http.post("/login", payload, c)
                    .success(function(res){
                        console.log("factory", res);
                        x.token = res.token;
                        lss.set("token", res.token);

                        if(res.token){
                            //$window.location.href = "/public/main/";
                            $location.path('/public/main/')
                        } else {
                            alert("Login Failed!");
                        }
                    })
                    .error(function(err){
                        alert("Username or Password Invalid!")
                    });
                return d.promise;
            }
        }
    }

})();

(function() {
    "use strict";
    angular.module("myapp").controller("loginController", [
        "$scope", "$window", "loginFactory", loginController
    ]);

    function loginController($scope, $window, factory) {

        /* jshint validthis: true */
        var vm = this;
        vm.message = "This is a sample for another angular ui-route";

        vm.loginPayload = {};
        vm.loginPayload.username = "";
        vm.loginPayload.password = "";

        vm.tokenSession = "";

        vm.login = function(){
            factory.login(vm.loginPayload).then(function(res){
                console.log("login", res);

                //vm.tokenSession = res.token;
                //console.log(vm.tokenSession);
                // if(res.token){
                //     $window.location.href = "/public";
                // } else {
                //     alert("Login Failed!");
                // }
                
            },function(error){
                console.log(error);
            });
        };
    }

})();

(function() {
    "use strict";
    angular.module("myapp").factory("mainFactory", [
        "$http", "$q", "loginFactory", "localStorageService", mainFactory
    ]);

    function mainFactory($http, $q, loginFactory, lss) {

        var config = loginFactory.config(lss.get("token"));

        return {
            getArticles: function(){
                var d = $q.defer();

                $http.get("/api/articles", config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            createArticle: function(payload){
                var d = $q.defer();

                $http.post("/api/new/articles/:payload", payload, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            updateArticle: function(payload){
                var d = $q.defer();

                $http.post("/api/update/articles/:payload", payload, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            deleteArticle: function(payload){
                var d = $q.defer();

                $http.post("/api/delete/articles/:payload", payload, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;

            },

            getRepoInfo: function(){
                var d = $q.defer();

                $http.get("https://api.github.com/repos/nenjotsu/go-angular-mongo")
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
            //console.log(vm.repoInfo);
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
    angular.module("myapp").config([
        "$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "localStorageServiceProvider",

        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, lss) {
            
            lss.setStorageType('sessionStorage');
            // For any unmatched url, send to /route1
            $urlRouterProvider.otherwise("/public/err404/");

            $stateProvider
                .state("login", {
                    url: "/public/",
                    controller: "loginController",
                    controllerAs: "vm",
                    templateUrl: "public/html/login/login.html"
                })
                .state("home", {
                    url: "/public/main/",
                    controller: "mainController",
                    controllerAs: "vm",
                    templateUrl: "public/html/home/home.html"
                })

            .state("notfound", {
                url: "/public/err404/",
                templateUrl: "public/html/404.html"
            });

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

