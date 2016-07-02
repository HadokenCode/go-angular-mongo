"use strict";
goApp.factory("PoActivityFactory", [
    "$http", "$q", "APIService",
    function($http, $q, apiService) {
        const urlApi = apiService.urlAPI;
        const f = {};
        var u = urlApi + "/api/poactivity";

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

        f.getDetails = function(payload) {
            const d = $q.defer();
            $http.post(u + "/details", payload, config)
                .success(d.resolve)
                .error(d.reject);
            return d.promise;
        }

        return f;
    }
]);