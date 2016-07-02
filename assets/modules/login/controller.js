"use strict";
goApp.controller("LoginController", [
    "$http", "$scope", "$state", "$window", "AuthenticationFactory", "localStorageService", "$location",
    function ($http, $scope, $state, $window, authentication, cookie, $location) {      

        $scope.currentPath = $location.path();

        $scope.obj = {
            userName: "",
            password: "",
            warehouse: ""
        };

        var ipInfo = "";

        $scope.authData = authentication.authData;

        var condition1 = angular.isUndefined(cookie.get("uName"));
        $scope.userName = (condition1) ? null : cookie.get("uName");

        var condition2 = angular.isUndefined(cookie.get("isffs"));
        $scope.isFFS = (condition2) ? false : cookie.get("isffs");
        cookie.set("isffs", $scope.isFFS);

        $scope.loading = false;
        $scope.animateError = false;

        $scope.editingItem = {};
        $scope.currentUserItem = {};

        $scope.foo = "";
        
        $scope.warehouses = [];

        $scope.getUserSloc = function(userName) {
            var payload = {};
            payload.UserName = userName;

            //console.log(payload);
            authentication.getUserWarehouse(payload).then(function(result) {

                //console.log(result);

                if(result.length==0){
                    swal("Warning", "No available warehouse/storage location for the username " + userName, "warning");
                    return;
                }
                $scope.obj.warehouse = result[0].warehouseCodes.slice(0,-1);
                //$scope.obj.warehouse = $scope.warehouses[0].warehouseCode;
                //console.log($scope.obj.warehouse);

            },function(){
                
            });
        };

        

        $scope.login = function(obj) {
            $scope.loading = true;
            /*authentication.login($scope.obj).then(function(results) {
                if (results[0] === false) {
                    var errorMessage = results[1];
                    swal({
                        title: "Login Failed",
                        text: "Username or Password is invalid!",
                        type: "warning",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            $scope.animateError = false;
                        }
                    });

                    $scope.loading = false;
                    $scope.animateError = true;
                    $scope.animate = false;
                    return;
                } else {
                    var message = results[1];
                    $scope.currentUserItem = results[0];
                    $scope.currentUserRole = $scope.authData.userRoles[0].itemArray[1];
                    $scope.userName = $scope.authData.userDetails[1];
                    $scope.currentUserId = $scope.authData.userDetails[0];
                    $scope.loading = false;
                    onload();
                }
            });*/
            $window.location.href = "#/main/home";
        };

        function onload() {
            $scope.editingItem = {};
            var mainP = "";
            cookie.set("uName", $scope.userName);
            //console.log($scope.currentUserRole);
            switch ($scope.currentUserRole) {
            case "OSR Admin":
                mainP = "#/main/home";
                break;
            case "OSR LoadPlan":
                mainP = "#/main/loadplan";
                break;
            case "OSR Picking":
                mainP = "#/main/warehouse_picking";
                break;
            case "OSR Consolidation":
                mainP = "#/main/checking_consolidation";
                break;
            case "OSR Loading":
                mainP = "#/main/loading_trucks";
                break;
            case "OSR Sales":
                mainP = "#/main/dashboard";
                break;
            default:
                swal({
                    title: "Login Failed",
                    text: "You are not allowed to access this site",
                    type: "warning",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        authentication.logout();
                    }
                });
                
                mainP = "#/login";
            }

            cookie.set("isffs", $scope.isFFS);
            $window.location.href = mainP;

            //ipInfo = angular.element("#myIpAdd").val();
            //globalFactory.logActivity($scope.authData.userDetails[0], 0, "1200", $scope.userName + ": Logged In with IP Address of " + ipInfo);
            
            $window.location.reload(true);
        }

        $scope.logout = function(e) {
            //ipInfo = angular.element("#myIpAdd").val();
            //globalFactory.logActivity($scope.authData.userDetails[0], 0, "1200", $scope.userName + ": Logged Out with IP Address of " + ipInfo);

            cookie.remove("uName");
            cookie.remove("isffs");
            e.preventDefault();
            authentication.logout();
            $window.location.href = "#/login";

        };

    }
]);
