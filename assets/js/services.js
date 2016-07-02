
goApp.factory("GlobalServices", [
    "$http", "$q", "$window",
    function($http, $q, $window) {

        var f = {};

        f.formatDate = function(value) {
            return moment(new Date(value)).format("MM/DD/YYYY");
        };

        f.datePickerOptions = function() {
            return datePickerOptions;
        };

        f.isNullOrEmpty = function(value) {
            if (value == null || value === "")
                return true;
            else
                return false;
        };

        f.formatDateTime = function(value) {
            if (angular.isUndefined(value))
                return "";
            return moment(new Date(value)).format("MM-DD-YYYY hh:mm A");            
        };

        f.exportExcel = function(data, exportTitle) {
            var dateString = moment(new Date()).format("MM-DD-YYYY hh:mm A");
            if (angular.isUndefined(exportTitle))
                exportTitle = "Exported";

            var cfg = {
                headers: true,
                sheetid: exportTitle,
                column: { style: { Font: { Bold: "5" } } }
            };
            alasql("SELECT * INTO XLSX('" + exportTitle + "_" + dateString + ".xlsx',?) FROM ?", [cfg, data]);
        };

        f.youreNotAllowed = function(){
            var swalConfirmation = {
                title: "Sorry!",
                text: "You are not allowed to access this page.",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true
            };
            var confirmFunction = function(isConfirm) {
                if (isConfirm) {
                    $window.location.href = '#/main/home';  
                    $window.location.reload(true);                   
                }
            };
            swal(swalConfirmation, confirmFunction);
            return;
        }; 


        return f;
    }
]);

goApp.factory("authInterceptorService", ["$q", "$injector", "$location", "localStorageService",
    function($q, $injector, $location, localStorageService) {

        var authInterceptorServiceFactory = {};

        var request = function(config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get("authorizationData");
            if (authData) {
                config.headers.Authorization = "Bearer " + authData.token;
            }

            if (authData == null) {
                $location.path("/login");
            }

            return config;
        };

        var responseError = function(rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get("AuthenticationFactory");
                authService.logOut();
                $location.path("/login");
            }
            return $q.reject(rejection);
        };

        authInterceptorServiceFactory.request = request;
        authInterceptorServiceFactory.responseError = responseError;

        return authInterceptorServiceFactory;
    }
]);

goApp.factory("APIService", function() {
  return {
      //urlAPI: 'http://172.16.145.63:8020'
      urlAPI: 'http://localhost:8082'
  };
});