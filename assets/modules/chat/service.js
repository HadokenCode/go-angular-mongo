"use strict";
goApp.factory("ChatFactory",
    ["$http", "$q", "APIService",
        function ($http, $q, apiService) {
            const urlApi = apiService.urlAPI;
            const f = {};
            var u = urlApi + "/api/Chat";

            var config = {
                headers: {
                    'Content-Type': "application/json; charset=utf-8"
                }
            }
            
            f.sendMessage = function (message) {
                const d = $q.defer();
                $http.post(u, message, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;
            };

            f.getMessage = function () {
                const d = $q.defer();
                $http.get(u, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;
            };

            f.getPrimaryImage = function () {
                const d = $q.defer();
                $http.get(u + "/primary", config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;
            };

            return f;
        }
    ]
);