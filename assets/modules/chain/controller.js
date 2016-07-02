"use strict";
goApp.controller("ChainController", [
    "$http", "$mdEditDialog", "$q", "$timeout", "$scope", "$mdDialog", "$mdMedia", "ChainFactory", "GlobalServices", "AuthenticationFactory",
    ChainController
]);

function ChainController($http, $mdEditDialog, $q, $timeout, $scope, $mdDialog, $mdMedia, factory, globalServices, af) {
    var ao = af.authData;
    // var userRole = ao.userRoles[0].itemArray[1];
    var userRole = "OSR Admin";

    if(userRole=='OSR Admin'||userRole=='OSR Sales'){}else{globalServices.youreNotAllowed();}

    $scope.loading = false;
    $scope.fd = globalServices.formatDate;
    $scope.fdt = globalServices.formatDateTime;

    $scope.options = {
        rowSelection: true,
        multiSelect: false,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
    };

    $scope.selected = [];
    $scope.limitOptions = [5, 8, 10, 15, 20, 50, 100, 500, 1000];

    $scope.query = {
        order: "ChainCode",
        limit: 8,
        page: 1
    };

    $scope.logPagination = function (page, limit) {
        console.log('page: ', page);
        console.log('limit: ', limit);
    };

    // for testing ngRepeat
    $scope.columns = [{
        name: "ChainCode",
        orderBy: "ChainCode"
    }, {
        descendFirst: true,
        name: "ChainCode",
        numeric: true,
        orderBy: "ChainCode"
    }];

    $scope.records = {};   
    $scope.randMess = "";

    var randomLoadingMessage = function() {
        var lines = new Array(
            "Eating butter coconut...",
            "Sipping noodles...",
            "Practicing my Kungfu while eating mamon...",
            "Generating records...",
            "Brewing coffee...",
            "Please be patient while getting data from the server..."
        );
        $scope.randMess = lines[Math.round(Math.random()*(lines.length-1))];
        //console.log($scope.randMess);
    } 

    $scope.toggleLimitOptions = function() {
        $scope.limitOptions = $scope.limitOptions ? undefined : [5, 8, 10, 15, 20, 50, 100, 500];
    };

    $scope.onPaginate = function(page, limit) {
        $scope.promise = $timeout(function() {
        }, 2000);
    };

    $scope.deselect = function(item) {
    };

    $scope.log = function(item) {
        $scope.chainDetails = item;
    };

    var setToGlobalRecords = function(r){
        $scope.records.data = [].concat(r);
    }
    var setToLastQuery = function(query){
        $scope.lastQuery = "";
        $scope.lastQuery = query;
    }
    var generateRecords = function(){
        randomLoadingMessage();
        $scope.loading = true;
        var payload = {};
        payload.query = "";
        setToLastQuery("");

        // factory.getRecords(payload).then(function(r) {
        //     setToGlobalRecords(r);
        //     $mdDialog.hide();
        //     $scope.loading = false;
        // }, function() {
        //     swal("Warning", "An error encountered, please check your query combination.");
        // });
    }

    $scope.loadStuff = function() {
        generateRecords();        
    };

    $scope.loadStuff();

    $scope.onReorder = function(order) {
        //console.log("Scope Order: " + $scope.query.order);
        //console.log("Order: " + order);

        $scope.promise = $timeout(function() {

        }, 2000);
    };

    /* Additionals */

    $scope.showExportConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Would you like to export this to csv?")
            .textContent("")
            .ariaLabel("Export")
            .targetEvent(ev)
            .ok("Yes, please export!")
            .cancel("Cancel");

        $mdDialog.show(confirm).then(function() {

            $scope.status = "Confirmed";
            //exportExcel = function(data, exportTitle) {
            //globalServices.exportExcel($scope.records.data, "POHeader");
            //
            var mystyle = { headers: true, column: { style: { Font: { Bold: "1" } } } };
            
            var sql = "";

            sql += "SELECT";
            sql += " chainCode AS Chain_Code";
            sql += " , chainName AS Chain_Name";

            sql += " INTO CSV('Chain_" + $scope.fdt(new Date()) + ".csv', {headers:true, separator:','}) FROM ?";

            alasql.promise(sql, [$scope.records.data])
                .then(function(result) {
                    //console.log(result);
                    if(result==1){
                        swal("success", "Your file is ready for download", "success");
                    }
                }).catch(function(err) {
                    swal("warning", "The file is too large, an error occured!", "warning");
                });;
        }, function() {
            $scope.status = "Cancelled";
        });
    };

    var updateChain = function(payload){
       swal({
            title: "Are you sure?",
            text: "You are about to update the Chain Code: " + payload.chainCode + " with a Chain Name: " + payload.chainName,
            type: "info",
            showConfirmButton: true,
            showCancelButton: true
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.loading = true;
                factory.updateChain(payload).then(function(){
                    //console.log(payload);

                    $scope.selected = [];
                    $scope.loading = false;
                    generateRecords();  
                    swal("Saved!", "Successfully updated the chain", "success"); 
                    $mdDialog.hide();

                });
            };
        }); 
    };
    var deleteChain = function(payload){
       swal({
            title: "Are you sure?",
            text: "You are about to delete the " + payload.chainCode,
            type: "warning",
            showConfirmButton: true,
            showCancelButton: true
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.loading = true;
                factory.deleteChain(payload).then(function(){
                    //console.log(payload);

                    $scope.selected = [];
                    $scope.loading = false;
                    generateRecords();  
                    swal("Deleted!", "Successfully deleted the chain", "success"); 
                    $mdDialog.hide();

                });
            };
        }); 
    };

    $scope.showChainDetails = function(ev, item) {

        function detailsController($scope, $mdDialog) {
            if(item==undefined){
                $scope.modalStatus = 'New';
            }else{
                $scope.modalStatus = 'Edit';
            }

            $scope.chainDetailsList = [].concat(item);
            //console.log(item);

            $scope.NewChainCode = "";
            $scope.NewChainName = "";

            $scope.updateChain = function(){
                var payload = {};

                if(item==undefined){
                    payload.chainCode = $scope.NewChainCode;
                    $scope.modalStatus = 'New';
                }else{
                    payload.chainCode = item.chainCode;
                }
                payload.chainName = $scope.NewChainName;
                updateChain(payload);  
            };

            $scope.deleteChain = function(){
                var payload = {};
                payload.id = item.id;
                payload.chainCode = item.chainCode;
                deleteChain(payload);  
            };

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }

        $mdDialog.show({
                controllerAs: "odc",
                controller: ["$scope", "$mdDialog", detailsController],
                templateUrl: "public/html/chain/view/detail.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
            }, function() {
            });
    };

    //$scope.optionsReport = settings.optionsReport;

    $scope.showMoreOptions = function(ev) {
        $mdDialog.show({
                controllerAs: "odc",
                controller: ["$scope", "$mdDialog", moreOptionsController],
                templateUrl: "public/html/chain/view/search.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {}, function() {});

        function moreOptionsController($scope, $mdDialog) {
            /*var payload = {};
            payload.poId = item.poId;

            factory.getDetails(payload).then(function(result) {
                $scope.poDetails = result;
            });*/

            $scope.records = {}; 
            $scope.records.data = []; 

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.loading = false;

            $scope.nextKey = 1;
            $scope.items = {
                0: { field: "C.ChainCode LIKE '%", keyword: "", dateFrom: "", dateTo: "", condition: "", value: "Chain Code contains " }
            };

            // $scope.remove = function(item) {
            //     console.log(item);
            //     delete $scope.items[item.$key];
            // };

            $scope.remove = function ( idx ) {
              delete $scope.items[idx];
              //$scope.items.splice(idx, 1);
            };

            $scope.delete = function ( idx ) {
              var person_to_delete = $scope.persons[idx];

              API.DeletePerson({ id: person_to_delete.id }, function (success) {
                $scope.persons.splice(idx, 1);
              });
            };

            $scope.add = function() {
                $scope.items[$scope.nextKey] = { field: "", keyword: "", dateFrom: "", dateTo: "", condition: " AND ", value: "", type: "String" };
                $scope.nextKey += 1;
                $scope.endClause = true;
            };

            var resetQuery = function() {

                $scope.items = {};
                $scope.items = { 0: { field: "C.ChainCode LIKE '%", keyword: "", dateFrom: "", dateTo: "", condition: "", value: "PO No contains ", type: "String" } };
            };

            $scope.newQuery = function() {
                //angular.element("#advancedSearch").modal("show");
                //resetQuery();
            };

            $scope.resetQuery = function() {
                resetQuery();
            };

            $scope.condition = [
                { text: " AND ", value: "AND" },
                { text: " OR ", value: "OR" }
            ];

            $scope.conditionIfDate = [
                { text: " AND ", value: "AND" },
                { text: " OR ", value: "OR" }
            ];

            $scope.fields = [
                { text: "C.ChainCode LIKE '%", value: "ChainCode", type: "String" },
                { text: "C.ChainName LIKE '%", value: "ChainName", type: "String" }
            ];

            $scope.endClause = true;
            $scope.changedCondition = function(item) {
                if (item.condition !== "%' ") {
                    $scope.endClause = false;
                } else {
                    $scope.endClause = true;
                }
            };
            $scope.changedField = function(item) {
                switch (item.field) {
                    case "C.ChainCode LIKE '%": item.value = "ChainCode contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "C.ChainName LIKE '%": item.value = "ChainName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    
                    default: item.value = "";
                }
            };

            $scope.loadStuff = function() {
                randomLoadingMessage();
                $scope.loading = true;
                    var payload = {};
                    var toString = [];
                    var lastQuery = [];

                    payload.query = "";
                    payload.topRow = "2000";
                    angular.forEach($scope.items, function(o) {
                        if(o.field==undefined || o.field==""){
                            return false;
                        }

                        if (o.dateFrom!=="") {
                            var dateF = moment(o.dateFrom);
                            var dateT = moment(o.dateTo);
                            if (dateF >= dateT) {
                                swal("Warning", "Please provide a valid date range!", "warning");
                                return false;
                            }
                            var currentKeyword = "'"+globalServices.formatDate(o.dateFrom)+ "'" + " AND " + "'" + globalServices.formatDate(o.dateTo) + "'";
                            o.keyword = currentKeyword;
                            toString.push(o.condition+" "); 
                            toString.push(o.field);                    
                            toString.push(o.keyword);

                            lastQuery.push(o.condition+" "); 
                            lastQuery.push(o.value);              
                            lastQuery.push(o.keyword);
                        } else {
                            toString.push(o.condition); 
                            toString.push(o.field);
                            toString.push(o.keyword);
                            toString.push("%' ");

                            lastQuery.push(o.condition); 
                            lastQuery.push(o.value);
                            lastQuery.push(" '" + o.keyword + "' ");
                        }
                        return false;
                    });

                    payload.query = toString.join("");
                    $scope.lastQuery = lastQuery.join("");

                    factory.getRecords(payload).then(function(r) {
                        setToGlobalRecords(r);
                        $mdDialog.hide();
                        $scope.loading = false;
                        setToLastQuery($scope.lastQuery);
                    }, function() {
                        console.log(payload.query);
                        swal("Warning", "An error encountered, please check your query combination.");
                    });
            };
        }
    };

} //end of controller function
