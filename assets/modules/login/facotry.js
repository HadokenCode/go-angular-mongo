"use strict";
goApp.factory("AuthenticationFactory", [
        "$http",
        "$q",
        "localStorageService",
         "APIService",
         "$window",
        function ($http, $q, storage, apiService) {

            var urlAPI = apiService.urlAPI;
            var authenticationFactory = {};
            var x = {
                userDetails: undefined,
                userModules: [],
                userRoles: {},
                acctCustomers: "",
                salesCustomers: "",
                cssCustomers: "",
                message: "",
                warehouse : "",
                availableWarehouse: ""
            };

            var config = {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            };
            
            var create = function (object) {
                var deferred = $q.defer();
                var config = {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                };
                $http.post(urlAPI + "/api/UserAccess", object, config).success(function (response) {

                        x.userDetails = undefined;
                        x.userModules = [];
                        x.message = "";
                        x.userRoles = {};
                        x.acctCustomers = "";
                        x.salesCustomers = "";
                        x.cssCustomers = "";

                        if (response[0]) {
                            x.userDetails = response[1];
                            x.userModules = response[2];
                            x.userRoles = response[3];
                            x.acctCustomers = response[4];
                            x.salesCustomers = response[5];
                            x.cssCustomers = response[6];
                            x.message = "";
                            x.warehouse = object.warehouse;
                            x.availableWarehouse = object.warehouse;
                        } else {
                            x.message = response[1];
                        }

                        storage.set("authorizationData", x);
                        deferred.resolve(response);
                    })
                    .error(deferred.reject);
                return deferred.promise;
            };

            /*var getWarehouse = function () {
                var deferred = $q.defer();
                $http.get(urlAPI + "/api/UserAccess")
                    .success(deferred.resolve)
                    .error(deferred.reject);
                return deferred.promise;
            };*/

            var getUserWarehouse = function (payload) {
                var deferred = $q.defer();
                $http.post(urlAPI + "/api/GetUserSlocs", payload, config)
                    .success(deferred.resolve)
                    .error(deferred.reject);
                return deferred.promise;
            };

            /*
            var create = function (origin) {
                var deferred = $q.defer();
                $http.get(origin + "/api/records")
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(deferred.reject);
                return deferred.promise;
            };*/

            var _logout = function () {
                storage.remove("authorizationData");
                x.userDetails = undefined;
                x.userModules = [];
                x.userRoles = [];
                x.message = "";
            };

            /*var get = function () {
                var deferred = $q.defer();
                $http.get('api/Customers').success(deferred.resolve).error(deferred.reject);
                return deferred.promise;
            };*/

            /*var search = function (s) {
                var deferred = $q.defer();
                $http.get('api/Customers?s=' + s).success(deferred.resolve).error(deferred.reject);
                return deferred.promise;
            };*/

            /*var _update = function (i, remark) {
                var deferred = $q.defer();
                $http.put("api/Customers/" + i, remark)
                    .success(deferred.resolve)
                    .error(deferred.reject);
                return deferred.promise;
            };

            var _delete = function (i) {
                var deferred = $q.defer();
                $http.delete("api/Customers/" + i)
                    .success(deferred.resolve)
                    .error(deferred.reject);
                return deferred.promise;
            };*/

            var _fillAuthData = function () {

                var authData = storage.get("authorizationData");
                if (authData) {
                    x.userDetails = authData.userDetails;
                    x.userModules = authData.userModules;
                    x.userRoles = authData.userRoles;
                    x.message = authData.message;
                    x.warehouse = authData.warehouse;
                }

            };

            // var getStorageLocation = function (userId) {
            //     var deferred = $q.defer();
            //     $http.get("api/StorageLocation/?payload=" + userId)
            //         .success(deferred.resolve)
            //         .error(deferred.reject);
            //     return deferred.promise;
            // };


            authenticationFactory.fillAuthData = _fillAuthData;
            authenticationFactory.authData = x;
            authenticationFactory.login = create;
            authenticationFactory.logout = _logout;
            //authenticationFactory.read = get;
            //authenticationFactory.search = search;
            //authenticationFactory.update = _update;
            //authenticationFactory.delete = _delete;
            //authenticationFactory.getStorageLocation = getStorageLocation;
            //authenticationFactory.getWarehouse = getWarehouse;
            authenticationFactory.getUserWarehouse = getUserWarehouse;

            return authenticationFactory;

        }
    ]);
