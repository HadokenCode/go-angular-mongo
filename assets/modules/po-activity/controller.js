"use strict";
goApp.controller("PoActivityController", [
    "$http", "$mdEditDialog", "$q", "$timeout", "$scope", "$mdDialog", "$mdMedia", "PoActivityFactory", "GlobalServices", "AuthenticationFactory",
    PoActivityController
]);

function PoActivityController($http, $mdEditDialog, $q, $timeout, $scope, $mdDialog, $mdMedia, factory, globalServices, af) {

    var ao = af.authData;
    var userRole = ao.userRoles[0].itemArray[1];
    if(userRole=='OSR Admin'||userRole=='OSR Sales'){}else{globalServices.youreNotAllowed();}

    $scope.loading = false;
    $scope.fd = globalServices.formatDate;
    $scope.fdt = globalServices.formatDateTime;

    $scope.getEarliestDate = function(){
        var args = Array.from(arguments);
        var orderedDates = args.sort(function(a,b){
                return Date.parse(a) > Date.parse(b);
            });
        if(orderedDates[0]!==null){
            return $scope.fdt(orderedDates[0]);
        }
        
    };

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
        order: "TruckAllocationNo",
        limit: 8,
        page: 1
    };

    $scope.logPagination = function (page, limit) {
        console.log('page: ', page);
        console.log('limit: ', limit);
    };

    // for testing ngRepeat
    $scope.columns = [{
        name: "PONo",
        orderBy: "PONo"
    }, {
        descendFirst: true,
        name: "SoldTo",
        numeric: true,
        orderBy: "SoldTo"
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
        console.log($scope.randMess);
    } 

    $scope.toggleLimitOptions = function() {
        $scope.limitOptions = $scope.limitOptions ? undefined : [5, 8, 10, 15, 20, 50, 100, 500, 1000];
    };

    $scope.onPaginate = function(page, limit) {
        //console.log("Scope Page: " + $scope.query.page + " Scope Limit: " + $scope.query.limit);
        //console.log("Page: " + page + " Limit: " + limit);
        $scope.promise = $timeout(function() {

        }, 2000);
    };

    $scope.deselect = function(item) {
        //console.log(item, "was deselected");
    };

    $scope.log = function(item) {
        $scope.poDetails = item;
        //console.log(item, "was selected");
    };

    var setToGlobalRecords = function(r){
        $scope.records.data = [].concat(r);
    }
    var setToLastQuery = function(query){
        $scope.lastQuery = "";
        $scope.lastQuery = query;
    }

    function getMonday() {
      var d = new Date();
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return globalServices.formatDate(d.setDate(diff));
    }

    function getSunday() {
      var d = new Date();
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1) + 6; // adjust when day is sunday
      return globalServices.formatDate(d.setDate(diff));
    }

    //console.log( getMonday() ); // Mon Nov 08 2010
    //console.log( getSunday() ); // Mon Nov 08 2010

    var generateRecords = function(){
        randomLoadingMessage();
        $scope.loading = true;
        var payload = {};
        payload.query = "PO.RequiredDeliveryDate BETWEEN '"+getMonday()+"' AND '"+getSunday()+"' ";
        payload.topRow = "2000";

        setToLastQuery("Required Delivery Date BETWEEN '"+getMonday()+"' AND '"+getSunday()+"' ");

        factory.getRecords(payload).then(function(r) {
            setToGlobalRecords(r);
            //console.log($scope.records.data);
            //angular.element("#advancedSearch").modal("hide");
            $mdDialog.hide();
            $scope.loading = false;
        }, function() {
            console.log(payload.query);
            swal("Warning", "An error encountered, please check your query combination.");
        });
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
            sql += " warehouseCode AS Warehouse_Code";
            sql += " , groupName AS Status";
            sql += " , poNo AS PO_No";
            sql += " , plateNo AS Plate_No";
            sql += " , invoiceNo AS Invoice_No";
            sql += " , requiredDeliveryDate AS Required_Delivery_Date";
            sql += " , billingDate AS Invoice_Date";
            sql += " , soldTo AS Customer_Code";
            sql += " , customerName AS Customer_Name";
            sql += " , soNo AS SO_No";
            sql += " , doNo AS DO_No";
            sql += " , orderDate AS Order_Date";            
            sql += " , orderType AS Order_Type";
            sql += " , submittedToSAPDate AS CSS_Processing_Date_Time";    
            sql += " , loadPlanApprovalDateTime AS OSR_Loadplan_Date_Time";    
            sql += " , pickingDateTime AS OSR_Picking_Date_Time";    
            sql += " , consolidationDateTime AS OSR_Consolidation_Date_Time";    
            sql += " , loadingDateTime AS OSR_Loading_To_Truck_Date_Time";    
            sql += " , dateTimeTruckerArrived AS Trucker_Arrived_Date_Time";    
            sql += " , dateTimeTruckerDeparted AS Trucker_Departed_Date_Time"; 
            sql += " , shipTo AS Ship_To";
            sql += " , shipToAddress AS Ship_To_Address";
            sql += " , shipToName AS Ship_To_Name";


            sql += " , orderType AS OrderType";
            sql += " , soNo AS SONo";
            sql += " , doNo AS DONo";
            sql += " , userName AS UserName";
            sql += " , orderStatus AS OrderStatus";
            sql += " , asmUserName AS AsmUserName";
            sql += " , address AS Address";
            sql += " , address1 AS Address1";
            sql += " , address2 AS Address2";
            sql += " , address3 AS Address3";
            sql += " , city AS City";
            sql += " , shipToContactNo AS ShipToContactNo";
            sql += " , shipmentNo AS ShipmentNo";
            sql += " , orderReason AS OrderReason";
            sql += " , truckType AS TruckType";
            sql += " , truckingCompany AS TruckingCompany";
            sql += " , internalOrder AS InternalOrder";
            sql += " , reprocessReason AS ReprocessReason";
            sql += " , sapErrorMessage AS SAPErrorMessage";
            sql += " , rejectedRemarks AS RejectedRemarks";
            sql += " , accountingUserName AS AccountingUserName";
            sql += " , loadPlanUserName AS LoadPlanUserName";
            sql += " , loadPlanApprovalUserName AS LoadPlanApprovalUserName";
            sql += " , pickingUserName AS PickingUserName";
            sql += " , loadingUserName AS LoadingUserName";
            sql += " , invoicingUserName AS InvoicingUserName";
            sql += " , truckerArrivedSMSMobile AS TruckerArrivedSMSMobile";
            sql += " , truckerArrivedSMSMessage AS TruckerArrivedSMSMessage";
            sql += " , truckerDepartedSMSMobile AS TruckerDepartedSMSMobile";
            sql += " , truckerDepartedSMSMessage AS TruckerDepartedSMSMessage";
            sql += " , totalQtyOrdered AS TotalQtyOrdered";
            sql += " , totalQtyAllocated AS TotalQtyAllocated";
            sql += " , totalQtyUndelivered AS TotalQtyUndelivered";
            sql += " , totalQtyServed AS TotalQtyServed";
            sql += " , totalCBM AS TotalCBM";
            sql += " , totalWeight AS TotalWeight";
            sql += " , ofr AS OFR";
            sql += " , area AS Area";
            sql += " , chainCode AS ChainCode";
            sql += " , chainName AS ChainName";
            sql += " , statusDescription AS StatusDescription";
            sql += " , consolidationUserName AS ConsolidationUserName";

            sql += " , dateEncoded AS DateEncoded";
            sql += " , dateUploaded AS DateUploaded";
            sql += " , pricingDate AS PricingDate";
            sql += " , weekNoDeliveryDate AS weekNoDeliveryDate";
            sql += " , yearDeliveryDate AS YearDeliveryDate";
            sql += " , weekNoOrderDate AS weekNoOrderDate";
            sql += " , yearOrderDate AS YearOrderDate";
            sql += " , weekNoDateEncoded AS weekNoDateEncoded";
            sql += " , yearDateEncoded AS YearDateEncoded";
            sql += " , weekNoDateUploaded AS weekNoDateUploaded";
            sql += " , yearDateUploaded AS YearDateUploaded";
            sql += " , weekNoSubmittedToSAPDate AS weekNoSubmittedToSAPDate";
            sql += " , yearSubmittedToSAPDate AS YearSubmittedToSAPDate";
            sql += " , rejectedDate AS RejectedDate";
            sql += " , dateTimeAcctApproved AS DateTimeAcctApproved";
            sql += " , dateTimeAcctDisapproved AS DateTimeAcctDisapproved";
            sql += " , dateTimeAsmApproved AS DateTimeAsmApproved";
            sql += " , dateTimeAsmDisapproved AS DateTimeAsmDisapproved";
            sql += " , prsUserName AS PrsUserName";
            sql += " , dateTimePrsApproved AS DateTimePrsApproved";
            sql += " , dateTimePrsDisapproved AS DateTimePrsDisapproved";
            sql += " , loadPlanDateTime AS LoadPlanDateTime";
            sql += " , invoicingDateTime AS InvoicingDateTime";

            sql += " , truckAllocationNo AS Truck_Allocation_No";
            //sql += ' INTO CSV("POActivity_' + moment().format("MM/DD/YYYY") + '.csv", {headers:true, separator:","}) FROM ?';
            // alasql.promise(query, [$scope.records.data])
            //     .then(function() {
            //         swal("success", "Successfully exported to CSV file", "success");
            //     }).catch(function(err) {
            //         swal("warning", "The file is too large, an error occured!", "warning");
            //     });;

            sql += " INTO CSV('POActivity_" + $scope.fdt(new Date()) + ".csv', {headers:true, separator:','}) FROM ?";
            //query += ' INTO CSV("POInquiry_' + moment().format("MM/DD/YYYY") + '.csv", {headers:true, separator:","}) FROM ?';
            

            //alasql(sql, [mystyle, $scope.records.data]);
            alasql.promise(sql, [$scope.records.data])
                .then(function(result) {
                    console.log(result);
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

    $scope.showOrderDetails = function(ev, item) {

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        function orderDetailsController($scope, $mdDialog) {

            var payload = {};
            payload.poId = item.poId;

            factory.getDetails(payload).then(function(result) {
                $scope.poDetails = result;
            });

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }

        $mdDialog.show({
                controllerAs: "odc",
                controller: ["$scope", "$mdDialog", orderDetailsController],
                templateUrl: "public/html/po-activity/view/order-details.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = "You said the information was '" + answer + "'.";
            }, function() {
                $scope.status = "You cancelled the dialog.";
            });

        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    //$scope.optionsReport = settings.optionsReport;

    $scope.showMoreOptions = function(ev) {
        $mdDialog.show({
                controllerAs: "odc",
                controller: ["$scope", "$mdDialog", moreOptionsController],
                templateUrl: "public/html/po-activity/view/more-options.html",
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
                0: { field: "PO.PONo LIKE '%", keyword: "", dateFrom: "", dateTo: "", condition: "", value: "PO No contains " }
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
                $scope.items = { 0: { field: "PO.PONo LIKE '%", keyword: "", dateFrom: "", dateTo: "", condition: "", value: "PO No contains ", type: "String" } };
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
                { text: "PO.WarehouseCode LIKE '%", value: "WarehouseCode", type: "String" },
                { text: "PO.GroupName LIKE '%", value: "GroupName", type: "String" },
                { text: "PO.PONo LIKE '%", value: "PONo", type: "String" },
                { text: "PO.PlateNo LIKE '%", value: "PlateNo", type: "String" },
                { text: "PO.InvoiceNo LIKE '%", value: "InvoiceNo", type: "String" },
                { text: "PO.RequiredDeliveryDate BETWEEN ", value: "RequiredDeliveryDate", type: "Date" },
                { text: "PO.BillingDate BETWEEN ", value: "BillingDate", type: "Date" },
                { text: "PO.SoldTo LIKE '%", value: "CustomerCode", type: "String" },
                { text: "PO.CustomerName LIKE '%", value: "CustomerName", type: "String" },
                { text: "PO.OrderDate BETWEEN ", value: "OrderDate", type: "Date" },
                { text: "PO.SubmittedToSAPDate BETWEEN ", value: "SubmittedToSAPDate", type: "Date" },
                { text: "PO.LoadPlanApprovalDateTime BETWEEN ", value: "LoadPlanApprovalDateTime", type: "Date" },
                { text: "PO.PickingDateTime BETWEEN ", value: "PickingDateTime", type: "Date" },
                { text: "PO.ConsolidationDateTime BETWEEN ", value: "ConsolidationDateTime", type: "Date" },
                { text: "PO.LoadingDateTime BETWEEN ", value: "LoadingDateTime", type: "Date" },
                { text: "PO.DateTimeTruckerArrived BETWEEN ", value: "DateTimeTruckerArrived", type: "Date" },
                { text: "PO.DateTimeTruckerDeparted BETWEEN ", value: "DateTimeTruckerDeparted", type: "Date" },
                { text: "PO.ShipTo LIKE '%", value: "ShipTo", type: "String" },
                { text: "PO.ShipToNameAddress LIKE '%", value: "ShipToNameAddress", type: "String" },
                { text: "PO.ShipToName LIKE '%", value: "ShipToName", type: "String" },
                { text: "PO.TruckAllocationNo LIKE '%", value: "TruckAllocationNo", type: "String" },


                { text: "PO.OrderType LIKE '%", value: "OrderType", type: "String" },
                { text: "PO.SONo LIKE '%", value: "SONo", type: "String" },
                { text: "PO.DONo LIKE '%", value: "DONo", type: "String" },
                { text: "PO.UserName LIKE '%", value: "CSSUserName LIKE '%", type: "String" },
                // { text: "PO.OrderStatus LIKE '%", value: "OrderStatus", type: "String" },
                { text: "PO.AsmUserName LIKE '%", value: "AsmUserName", type: "String" },
                { text: "PO.Address LIKE '%", value: "Address", type: "String" },
                // { text: "PO.Address1 LIKE '%", value: "Address1", type: "String" },
                // { text: "PO.Address2 LIKE '%", value: "Address2", type: "String" },
                // { text: "PO.Address3 LIKE '%", value: "Address3", type: "String" },
                // { text: "PO.City LIKE '%", value: "City", type: "String" },
                // { text: "PO.ShipToContactNo LIKE '%", value: "ShipToContactNo", type: "String" },
                // { text: "PO.ShipmentNo LIKE '%", value: "ShipmentNo", type: "String" },
                // { text: "PO.OrderReason LIKE '%", value: "OrderReason", type: "String" },
                // { text: "PO.TruckType LIKE '%", value: "TruckType", type: "String" },
                // { text: "PO.TruckingCompany LIKE '%", value: "TruckingCompany", type: "String" },
                { text: "PO.InternalOrder LIKE '%", value: "InternalOrder", type: "String" },
                // { text: "PO.ReprocessReason LIKE '%", value: "ReprocessReason", type: "String" },
                // { text: "PO.SAPErrorMessage LIKE '%", value: "SAPErrorMessage", type: "String" },
                // { text: "PO.RejectedRemarks LIKE '%", value: "RejectedRemarks", type: "String" },
                { text: "PO.AccountingUserName LIKE '%", value: "AccountingUserName", type: "String" },
                { text: "PO.LoadPlanUserName LIKE '%", value: "LoadPlanUserName", type: "String" },
                // { text: "PO.LoadPlanApprovalUserName LIKE '%", value: "LoadPlanApprovalUserName", type: "String" },
                // { text: "PO.PickingUserName LIKE '%", value: "PickingUserName", type: "String" },
                // { text: "PO.LoadingUserName LIKE '%", value: "LoadingUserName", type: "String" },
                // { text: "PO.InvoicingUserName LIKE '%", value: "InvoicingUserName", type: "String" },
                // { text: "PO.TruckerArrivedSMSMobile LIKE '%", value: "TruckerArrivedSMSMobile", type: "String" },
                // { text: "PO.TruckerArrivedSMSMessage LIKE '%", value: "TruckerArrivedSMSMessage", type: "String" },
                // { text: "PO.TruckerDepartedSMSMobile LIKE '%", value: "TruckerDepartedSMSMobile", type: "String" },
                // { text: "PO.TruckerDepartedSMSMessage LIKE '%", value: "TruckerDepartedSMSMessage", type: "String" },
                // { text: "PO.TotalQtyOrdered LIKE '%", value: "TotalQtyOrdered", type: "String" },
                // { text: "PO.TotalQtyAllocated LIKE '%", value: "TotalQtyAllocated", type: "String" },
                // { text: "PO.TotalQtyUndelivered LIKE '%", value: "TotalQtyUndelivered", type: "String" },
                // { text: "PO.TotalQtyServed LIKE '%", value: "TotalQtyServed", type: "String" },
                // { text: "PO.TotalCBM LIKE '%", value: "TotalCBM", type: "String" },
                // { text: "PO.TotalWeight LIKE '%", value: "TotalWeight", type: "String" },
                // { text: "PO.OFR LIKE '%", value: "OFR", type: "String" },
                { text: "PO.Area LIKE '%", value: "Area", type: "String" },
                { text: "PO.ChainCode LIKE '%", value: "ChainCode", type: "String" },
                { text: "PO.ChainName LIKE '%", value: "ChainName", type: "String" },
                { text: "PO.StatusDescription LIKE '%", value: "StatusDescription", type: "String" },
                // { text: "PO.ConsolidationUserName LIKE '%", value: "ConsolidationUserName", type: "String" },

                // { text: "PO.DateEncoded BETWEEN ", value: "DateEncoded", type: "Date" },
                // { text: "PO.DateUploaded BETWEEN ", value: "DateUploaded", type: "Date" },
                // { text: "PO.PricingDate BETWEEN ", value: "PricingDate", type: "Date" },
                // { text: "PO.weekNoDeliveryDate BETWEEN ", value: "weekNoDeliveryDate", type: "Date" },
                // { text: "PO.YearDeliveryDate BETWEEN ", value: "YearDeliveryDate", type: "Date" },
                // { text: "PO.weekNoOrderDate BETWEEN ", value: "weekNoOrderDate", type: "Date" },
                // { text: "PO.YearOrderDate BETWEEN ", value: "YearOrderDate", type: "Date" },
                // { text: "PO.weekNoDateEncoded BETWEEN ", value: "weekNoDateEncoded", type: "Date" },
                // { text: "PO.YearDateEncoded BETWEEN ", value: "YearDateEncoded", type: "Date" },
                // { text: "PO.weekNoDateUploaded BETWEEN ", value: "weekNoDateUploaded", type: "Date" },
                // { text: "PO.YearDateUploaded BETWEEN ", value: "YearDateUploaded", type: "Date" },
                // { text: "PO.weekNoSubmittedToSAPDate BETWEEN ", value: "weekNoSubmittedToSAPDate", type: "Date" },
                // { text: "PO.YearSubmittedToSAPDate BETWEEN ", value: "YearSubmittedToSAPDate", type: "Date" },
                // { text: "PO.RejectedDate BETWEEN ", value: "RejectedDate", type: "Date" },
                // { text: "PO.DateTimeAcctApproved BETWEEN ", value: "DateTimeAcctApproved", type: "Date" },
                // { text: "PO.DateTimeAcctDisapproved BETWEEN ", value: "DateTimeAcctDisapproved", type: "Date" },
                // { text: "PO.DateTimeAsmApproved BETWEEN ", value: "DateTimeAsmApproved", type: "Date" },
                // { text: "PO.DateTimeAsmDisapproved BETWEEN ", value: "DateTimeAsmDisapproved", type: "Date" },
                // { text: "PO.PrsUserName LIKE '%", value: "PrsUserName", type: "String" },
                // { text: "PO.DateTimePrsApproved BETWEEN ", value: "DateTimePrsApproved", type: "Date" },
                // { text: "PO.DateTimePrsDisapproved BETWEEN ", value: "DateTimePrsDisapproved", type: "Date" },
                // { text: "PO.LoadPlanDateTime BETWEEN ", value: "LoadPlanDateTime", type: "Date" },
                // { text: "PO.InvoicingDateTime BETWEEN ", value: "InvoicingDateTime", type: "Date" },
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
                    case "PO.WarehouseCode LIKE '%": item.value = "WarehouseCode contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.GroupName LIKE '%": item.value = "GroupName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.PONo LIKE '%": item.value = "PONo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.PlateNo LIKE '%": item.value = "PlateNo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.InvoiceNo LIKE '%": item.value = "InvoiceNo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.RequiredDeliveryDate BETWEEN ": item.value = "RequiredDeliveryDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.BillingDate BETWEEN ": item.value = "BillingDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.SoldTo LIKE '%": item.value = "SoldTo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.CustomerName LIKE '%": item.value = "CustomerName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.OrderDate BETWEEN ": item.value = "OrderDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.SubmittedToSAPDate BETWEEN ": item.value = "SubmittedToSAPDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.LoadPlanApprovalDateTime BETWEEN ": item.value = "LoadPlanApprovalDateTime contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.PickingDateTime BETWEEN ": item.value = "PickingDateTime contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.ConsolidationDateTime BETWEEN ": item.value = "ConsolidationDateTime contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.LoadingDateTime BETWEEN ": item.value = "LoadingDateTime contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.DateTimeTruckerArrived BETWEEN ": item.value = "DateTimeTruckerArrived contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.DateTimeTruckerDeparted BETWEEN ": item.value = "DateTimeTruckerDeparted contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    case "PO.ShipTo LIKE '%": item.value = "ShipTo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.ShipToNameAddress LIKE '%": item.value = "ShipToNameAddress contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.ShipToName LIKE '%": item.value = "ShipToName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.TruckAllocationNo LIKE '%": item.value = "TruckAllocationNo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;


                    case "PO.OrderType LIKE '%": item.value = "OrderType contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.SONo LIKE '%": item.value = "SONo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.DONo LIKE '%": item.value = "DONo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.UserName LIKE '%": item.value = "CSSUserName LIKE '% contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.OrderStatus LIKE '%": item.value = "OrderStatus contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.AsmUserName LIKE '%": item.value = "AsmUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.Address LIKE '%": item.value = "Address contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.Address1 LIKE '%": item.value = "Address1 contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.Address2 LIKE '%": item.value = "Address2 contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.Address3 LIKE '%": item.value = "Address3 contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.City LIKE '%": item.value = "City contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.ShipToContactNo LIKE '%": item.value = "ShipToContactNo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.ShipmentNo LIKE '%": item.value = "ShipmentNo contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.OrderReason LIKE '%": item.value = "OrderReason contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TruckType LIKE '%": item.value = "TruckType contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TruckingCompany LIKE '%": item.value = "TruckingCompany contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.InternalOrder LIKE '%": item.value = "InternalOrder contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.ReprocessReason LIKE '%": item.value = "ReprocessReason contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.SAPErrorMessage LIKE '%": item.value = "SAPErrorMessage contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.RejectedRemarks LIKE '%": item.value = "RejectedRemarks contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.AccountingUserName LIKE '%": item.value = "AccountingUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.LoadPlanUserName LIKE '%": item.value = "LoadPlanUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.LoadPlanApprovalUserName LIKE '%": item.value = "LoadPlanApprovalUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.PickingUserName LIKE '%": item.value = "PickingUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.LoadingUserName LIKE '%": item.value = "LoadingUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.InvoicingUserName LIKE '%": item.value = "InvoicingUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TruckerArrivedSMSMobile LIKE '%": item.value = "TruckerArrivedSMSMobile contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TruckerArrivedSMSMessage LIKE '%": item.value = "TruckerArrivedSMSMessage contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TruckerDepartedSMSMobile LIKE '%": item.value = "TruckerDepartedSMSMobile contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TruckerDepartedSMSMessage LIKE '%": item.value = "TruckerDepartedSMSMessage contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TotalQtyOrdered LIKE '%": item.value = "TotalQtyOrdered contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TotalQtyAllocated LIKE '%": item.value = "TotalQtyAllocated contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TotalQtyUndelivered LIKE '%": item.value = "TotalQtyUndelivered contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TotalQtyServed LIKE '%": item.value = "TotalQtyServed contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TotalCBM LIKE '%": item.value = "TotalCBM contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.TotalWeight LIKE '%": item.value = "TotalWeight contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.OFR LIKE '%": item.value = "OFR contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.Area LIKE '%": item.value = "Area contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.ChainCode LIKE '%": item.value = "ChainCode contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.ChainName LIKE '%": item.value = "ChainName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    case "PO.StatusDescription LIKE '%": item.value = "StatusDescription contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.ConsolidationUserName LIKE '%": item.value = "ConsolidationUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;

                    // case "PO.DateEncoded BETWEEN ": item.value = "DateEncoded contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.DateUploaded BETWEEN ": item.value = "DateUploaded contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.PricingDate BETWEEN ": item.value = "PricingDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.weekNoDeliveryDate BETWEEN ": item.value = "weekNoDeliveryDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.YearDeliveryDate BETWEEN ": item.value = "YearDeliveryDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.weekNoOrderDate BETWEEN ": item.value = "weekNoOrderDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.YearOrderDate BETWEEN ": item.value = "YearOrderDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.weekNoDateEncoded BETWEEN ": item.value = "weekNoDateEncoded contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.YearDateEncoded BETWEEN ": item.value = "YearDateEncoded contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.weekNoDateUploaded BETWEEN ": item.value = "weekNoDateUploaded contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.YearDateUploaded BETWEEN ": item.value = "YearDateUploaded contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.weekNoSubmittedToSAPDate BETWEEN ": item.value = "weekNoSubmittedToSAPDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.YearSubmittedToSAPDate BETWEEN ": item.value = "YearSubmittedToSAPDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.RejectedDate BETWEEN ": item.value = "RejectedDate contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.DateTimeAcctApproved BETWEEN ": item.value = "DateTimeAcctApproved contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.DateTimeAcctDisapproved BETWEEN ": item.value = "DateTimeAcctDisapproved contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.DateTimeAsmApproved BETWEEN ": item.value = "DateTimeAsmApproved contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.DateTimeAsmDisapproved BETWEEN ": item.value = "DateTimeAsmDisapproved contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.PrsUserName LIKE '%": item.value = "PrsUserName contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="String"; break;
                    // case "PO.DateTimePrsApproved BETWEEN ": item.value = "DateTimePrsApproved contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.DateTimePrsDisapproved BETWEEN ": item.value = "DateTimePrsDisapproved contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.LoadPlanDateTime BETWEEN ": item.value = "LoadPlanDateTime contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    // case "PO.InvoicingDateTime BETWEEN ": item.value = "InvoicingDateTime contains", item.keyword = "", item.dateFrom = "", item.dateTo = "", item.type ="Date"; break;
                    
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
