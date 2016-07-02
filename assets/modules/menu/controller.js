"use strict";
goApp.controller("MainController", [
    "$scope", "$timeout", "MainService", "$mdSidenav", "$mdBottomSheet",
    "$log", "$q", "AuthenticationFactory", "$window", "$mdDialog",
    MainController
]);
/**
 * Main Controller for the Angular Material
 * @param $scope
 * @param $mdSidenav
 * @param avatarsService
 * @constructor
 */
function MainController($scope, $timeout, mainService, $mdSidenav, $mdBottomSheet, $log, $q, af, $window, $mdDialog) {

    //var ao = af.authData;
    // var userId = ao.userDetails[0],
    //     userName = ao.userDetails[1],
    //     userRole = ao.userRoles[0].itemArray[1],
    //     warehouse = ao.warehouse;
    var userId = 1,
        userName = "OSR Admin",
        userRole = "OSR Admin";

    $scope.hasAccess = function(url) {
        //url = "home";
        if (
            (url == "main" ||
                url == "main.home" ||
                url == "main.dashboard" ||
                url == "main.loadplan" ||
                url == "main.warehouse_picking" ||
                url == "main.checking_consolidation" ||
                url == "main.loading_trucks" ||
                url == "main.howto" ||
                url == "main.chain" ||
                // url == "main.report_trucker_logs" ||
                url == "main.po_activity") && userRole == "OSR Admin") {
            return true;
        } else if (
            (url == "main.dashboard" ||
                url == "main.howto" ||
                url == "main.po_activity") && userRole == "OSR Sales") {
            return true;
        } else if (
            (url == "main.loadplan" || url == "main.howto")

            && userRole == "OSR LoadPlan") {
            return true;
        } else if (
            (url == "main.warehouse_picking" || url == "main.howto") && userRole == "OSR Picking") {
            return true;
        } else if (
            (url == "main.checking_consolidation" || url == "main.howto") && userRole == "OSR Consolidation") {
            return true;
        } else if (
            (url == "main.loading_trucks" || url == "main.howto") && userRole == "OSR Loading") {
            return true;
        } else {
            return false;
        }

    };

    var self = this;

    self.selected = null;
    self.main = [];
    self.selectMenu = selectMenu;
    self.toggleList = toggleMenusList;
    self.makeContact = makeContact;

    // Load all registered main

    mainService.loadAllMenus().then(function(main) {
        self.main = [].concat(main);
        self.selected = main[0];
    });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleMenusList() {
        $mdSidenav("left").toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectMenu(main) {
        //console.log(main);
        $window.location.href = main.content;
        //self.selected = angular.isNumber(main) ? $scope.main[main] : main;
        $window.location.reload(true);
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function makeContact(selectedMenu) {

        $mdBottomSheet.show({
            controllerAs: "cp",
            templateUrl: "assets/modules/menu/view/contactSheet.html",
            controller: ["$mdBottomSheet", contactSheetController],
            parent: angular.element(document.getElementById("content"))
        }).then(function(clickedItem) {
            $log.debug(clickedItem.name + " clicked!");
        });

        /**
         * Menu ContactSheet controller
         */
        function contactSheetController($mdBottomSheet) {
            this.main = selectedMenu;
            this.actions = [
                { name: "MS Excel", icon: "phone", icon_url: "assets/svg/excel-icon.svg" }
                // { name: "Phone", icon: "phone", icon_url: "assets/svg/phone.svg" },
                // { name: "Twitter", icon: "twitter", icon_url: "assets/svg/twitter.svg" },
                // { name: "Google+", icon: "google_plus", icon_url: "assets/svg/google_plus.svg" },
                // { name: "Hangout", icon: "hangouts", icon_url: "assets/svg/hangouts.svg" }
            ];
            this.contactMenu = function(action, name) {
                // The actually contact process has not been implemented...
                // so just hide the bottomSheet
                //console.log(name);

                $mdBottomSheet.hide(action);
            };
        }
    }


    // left & right sidenav

    $scope.toggleLeft = buildDelayedToggler("left");
    $scope.toggleRight = buildToggler("right");
    $scope.isOpenRight = function() {
        return $mdSidenav("right").isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navId) {
        return debounce(function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navId)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navId + " is done");
                });
        }, 200);
    }

    function buildToggler(navId) {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navId)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navId + " is done");
                });
        }
    }
    $scope.showAdvanced = function(ev) {
        //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
                controller: UserAccountController,
                templateUrl: 'assets/modules/menu/view/user-account.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                //fullscreen: useFullScreen
            })
            .then(function(answer) {
                //$scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                //$scope.status = 'You cancelled the dialog.';
            });
        // $scope.$watch(function() {
        //     return $mdMedia('xs') || $mdMedia('sm');
        // }, function(wantsFullScreen) {
        //     $scope.customFullscreen = (wantsFullScreen === true);
        // });
    };

    function UserAccountController($scope, $mdDialog) {

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.userName = "OSR Admin",
        $scope.userRole = "OSR Admin",
        $scope.warehouse = "LP";
    }
}


// Prepare the 'main' module for subsequent registration of controllers and delegates
goApp.controller("LeftCtrl", function($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav("left").close()
            .then(function() {
                $log.debug("close LEFT is done");
            });
    };
});
goApp.controller("RightCtrl", function($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav("right").close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });
    };
});
goApp.controller("SpeedDial", function($scope) {
    // this.topDirections = ['left', 'up'];
    //   this.bottomDirections = ['down', 'right'];
    this.isOpen = false;
    //   this.availableModes = ['md-fling', 'md-scale'];
    this.selectedMode = 'md-fling';
    //   this.availableDirections = ['up', 'down', 'left', 'right'];
    this.selectedDirection = 'up';
});
