"use strict";
goApp.factory("ChainFactory", [
    "$http", "$q", "APIService",
    function($http, $q, apiService) {
        const urlApi = apiService.urlAPI;
        const f = {};
        var u = urlApi + "/api/Chain";

        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        f.getRecords = function(payload) {
            const d = $q.defer();
            $http.post(u, payload, config)
                .success(d.resolve)
                .error(d.reject);
            return d.promise;
        };

        f.updateChain = function(payload) {
            const d = $q.defer();
            $http.post(u + "/update", payload, config)
                .success(d.resolve)
                .error(d.reject);
            return d.promise;
        };

        f.deleteChain = function(payload) {
            const d = $q.defer();
            $http.post(u + "/delete", payload, config)
                .success(d.resolve)
                .error(d.reject);
            return d.promise;
        };

        return f;
    }
]);