"use strict";
goApp.factory("DashboardService",
    ["$http", "$q", "APIService",
        function ($http, $q, apiService) {
            const urlApi = apiService.urlAPI;
            const f = {};
            var u = urlApi + "/api/dashboard";
            var config = {
                headers: {
                    'Content-Type': "application/json; charset=utf-8"
                }
            }

            f.getParameters = function (payload) {
                const d = $q.defer();
                $http.post(u + "/parameters", payload, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;
            };

            f.getPieChart = function (payload) {
                const d = $q.defer();
                $http.post(u + "/PieChart", payload ,config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;
            };

            f.getBarChart = function(payload) {
                const d = $q.defer();
                //console.log(JSON.stringify(payload));
                $http.post(u + "/BarChart",payload, config)
                    .success(d.resolve)
                    .error(d.reject);
                return d.promise;
            };

            

            return f;
        }
    ]
);