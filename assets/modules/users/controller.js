"use strict";
goApp.controller("UserController", [
    "$http", "$mdEditDialog", "$q", "$timeout", "$scope", "$mdDialog", "UserService", "GlobalServices",
    UserController
]);

function UserController($http, $mdEditDialog, $q, $timeout, $scope, $mdDialog, userService, globalServices) {
    "use strict";

    $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
    };

    $scope.selected = [];
    $scope.limitOptions = [5, 10, 15];

    $scope.query = {
        order: "name",
        limit: 10,
        page: 1
    };

    // for testing ngRepeat
    $scope.columns = [{
            name: "Dessert",
            orderBy: "name",
            unit: "100g serving"
        }, {
            descendFirst: true,
            name: "Type",
            orderBy: "type"
        }, {
            name: "Calories",
            numeric: true,
            orderBy: "calories.value"
        }, {
            name: "Fat",
            numeric: true,
            orderBy: "fat.value",
            unit: "g"
        },
        /* {
           name: "Carbs",
           numeric: true,
           orderBy: "carbs.value",
           unit: "g"
         }, */
        {
            name: "Protein",
            numeric: true,
            orderBy: "protein.value",
            trim: true,
            unit: "g"
        },
        /* {
           name: "Sodium",
           numeric: true,
           orderBy: "sodium.value",
           unit: "mg"
         }, {
           name: "Calcium",
           numeric: true,
           orderBy: "calcium.value",
           unit: "%"
         }, */
        {
            name: "Iron",
            numeric: true,
            orderBy: "iron.value",
            unit: "%"
        }, {
            name: "Comments",
            orderBy: "comment"
        }
    ];

    userService.loadAllDesserts().then(function(result) {
        //console.log(result);
        $scope.desserts = {};
        $scope.desserts.data = [].concat(result);
        //$scope.limitOptions = [5, 10, 15];
    });

    //$http.get($scope.dessert).then(function(desserts) {
    //    $scope.desserts = desserts.data;

    // $scope.selected.push($scope.desserts.data[1]);

    // $scope.selected.push({
    //   name: "Ice cream sandwich",
    //   type: "Ice cream",
    //   calories: { value: 237.0 },
    //   fat: { value: 9.0 },
    //   carbs: { value: 37.0 },
    //   protein: { value: 4.3 },
    //   sodium: { value: 129.0 },
    //   calcium: { value: 8.0 },
    //   iron: { value: 1.0 }
    // });

    // $scope.selected.push({
    //   name: "Eclair",
    //   type: "Pastry",
    //   calories: { value:  262.0 },
    //   fat: { value: 16.0 },
    //   carbs: { value: 24.0 },
    //   protein: { value:  6.0 },
    //   sodium: { value: 337.0 },
    //   calcium: { value:  6.0 },
    //   iron: { value: 7.0 }
    // });

    // $scope.promise = $timeout(function () {
    //   $scope.desserts = desserts.data;
    // }, 1000);
    //});

    $scope.editComment = function(event, dessert) {
        event.stopPropagation();

        var dialog = {
            // messages: {
            //   test: "I don\"t like tests!"
            // },
            modelValue: dessert.comment,
            placeholder: "Add a comment",
            save: function(input) {
                dessert.comment = input.$modelValue;
            },
            targetEvent: event,
            title: "Add a comment",
            validators: {
                "md-maxlength": 30
            }
        };

        var promise = $scope.options.largeEditDialog ? $mdEditDialog.large(dialog) : $mdEditDialog.small(dialog);

        promise.then(function(ctrl) {
            var input = ctrl.getInput();

            input.$viewChangeListeners.push(function() {
                input.$setValidity("test", input.$modelValue !== "test");
            });
        });
    };

    $scope.toggleLimitOptions = function() {
        $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
    };

    $scope.getTypes = function() {
        return ["Candy", "Ice cream", "Other", "Pastry"];
    };

    $scope.onPaginate = function(page, limit) {
        console.log("Scope Page: " + $scope.query.page + " Scope Limit: " + $scope.query.limit);
        console.log("Page: " + page + " Limit: " + limit);

        $scope.promise = $timeout(function() {

        }, 2000);
    };

    $scope.deselect = function(item) {
        console.log(item.name, "was deselected");
    };

    $scope.log = function(item) {
        console.log(item.name, "was selected");
    };

    $scope.loadStuff = function() {
        $scope.promise = $timeout(function() {

        }, 2000);
    };

    $scope.onReorder = function(order) {

        console.log("Scope Order: " + $scope.query.order);
        console.log("Order: " + order);

        $scope.promise = $timeout(function() {

        }, 2000);
    };

    /* Additionals */

    $scope.showExportConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Would you like to export this to excel?")
            .textContent("You are about to export the data as excel file")
            .ariaLabel("Export")
            .targetEvent(ev)
            .ok("Yes, please export!")
            .cancel("Cancel");
        $mdDialog.show(confirm).then(function() {
            $scope.status = "Confirmed";
            //exportExcel = function(data, exportTitle) {
            globalServices.exportExcel($scope.desserts.data, "DessertsTitle");
        }, function() {
            $scope.status = "Cancelled";
        });
    };

    $scope.showOrderDetails = function(ev) {
        $mdDialog.show({
                controllerAs: "odc",
                controller: ["$scope", "$mdDialog", OrderDetailsController],
                templateUrl: "public/html/users/view/order-details.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                $scope.status = "You said the information was '" + answer + "'.";
            }, function() {
                $scope.status = "You cancelled the dialog.";
            });

        function OrderDetailsController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

    };

    $scope.showMoreOptions = function(ev){
        $mdDialog.show({
                controllerAs: "odc",
                controller: ["$scope", "$mdDialog", MoreOptionsController],
                templateUrl: "public/html/users/view/more-options.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                $scope.status = "You said the information was '" + answer + "'.";
            }, function() {
                $scope.status = "You cancelled the dialog.";
            });

        function MoreOptionsController($scope, $mdDialog){
            
        }
    };

} //end of controller function
