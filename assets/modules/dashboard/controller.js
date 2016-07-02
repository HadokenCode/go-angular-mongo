"use strict";
goApp.controller("DashboardController", [
    "$scope", "DashboardService", "GlobalServices", "$timeout", "$q", "$log", "AuthenticationFactory",
    DashboardController
]);

function DashboardController($scope, service, globalServices, $timeout, $q, $log, af) {
    var ao = af.authData;
    var userRole = ao.userRoles[0].itemArray[1];
    console.log(ao);
    var hasAllParams = false;
    if (userRole == 'OSR Admin' || userRole == 'OSR Sales') {
        hasAllParams = true;
    } else { globalServices.youreNotAllowed(); }

    $scope.loading = true;
    $scope.loadingResources = true;
    var exportObj = [];

    //Start SignalR
    var connection = $.hubConnection();
    var dashboardHub = connection.createHubProxy("DashboardHub");
    dashboardHub.on("receivedashboardvalue", function() {});
    var sendDashboardValue = function() {
        dashboardHub.invoke("sendDashboardValue")
            .done(function() {})
            .fail(function() {});
    }
    connection.start()
        .done(function() { sendDashboardValue() })
        .fail(function() {});
    //End SignalR

    //Start Filter
    $scope.payload = {}
    $scope.areas = [];
    $scope.chains = [];
    $scope.warehouses = [];
    $scope.weekToDates = [];
    $scope.reportDataTypes = [
        { name: "Po Count", value: 0 },
        { name: "Total Quantity", value: 1 }
    ];

    function getParams(payload){
        service.getParameters(payload).then(function(result) {
            console.log(result);
            $scope.areas = result.area;
            $scope.chains = result.chain;
            $scope.warehouses = result.warehouse;
            $scope.weekToDates = result.weekToDate;

            if(userRole == 'OSR Admin'){

                $scope.areas.unshift({ areaName: "All" });
                $scope.chains.unshift({ chainCode: "All", chainName: "All" });
                $scope.warehouses.unshift({ sLocName: "All" });
            }


            $scope.payload = {
                area: $scope.areas[0].areaName,
                chain: $scope.chains[0].chainCode,
                warehouse: $scope.warehouses[0].sLocName,
                weekToDate: JSON.stringify($scope.weekToDates[0]),
                reportData: $scope.reportDataTypes[0].value
            };

            $scope.filter($scope.payload);
            $scope.loadingResources = false;
        });
    };

    getParams({userId:ao.userDetails[0]});

    $scope.filter = function(payload) {
        var currentPayload = {
            area: payload.area === "All" ? null : payload.area,
            chain: payload.chain === "All" ? null : payload.chain,
            warehouse: payload.warehouse === "All" ? null : payload.warehouse,
            weekToDate: JSON.parse(payload.weekToDate),
            reportData: payload.reportData
        };
        $scope.fday = globalServices.formatDate(currentPayload.weekToDate.dateFrom);
        $scope.lday = globalServices.formatDate(currentPayload.weekToDate.dateTo);
        //Get Pie Chart
        $scope.getPieChart(currentPayload);

        //Get Bar Chart
        $scope.getBarChart(currentPayload);
    };
    //End Filter

    $scope.colorScheme = [];

    //Start Pie Chart
    $scope.getPieChart = function(payload) {
        service.getPieChart(payload).then(function(value) {
            $scope.totalCounts = 0;
            exportObj = value;
            angular.forEach(value, function(o) {
                delete o.$$hashKey;

                $scope.totalCounts += o.y;

                if (o.key === "CSS - For Processing") {
                    o.color = "#FFD740";
                } else if (o.key === "CSS - New PO") {
                    o.color = "#FFD740";
                } else if (o.key === "Invoiced - Delivered to Customer") {
                    o.color = "#2CA02C";
                } else if (o.key === "Invoiced - In Transit") {
                    o.color = "#2CA02C";
                } else if (o.key === "Sales - Cancelled/Error") {
                    o.color = "#FFD740";
                } else if (o.key === "Sales - Hold/For Approval") {
                    o.color = "#FFD740";
                } else if (o.key === "Warehouse - For Consolidation") {
                    o.color = "#FF5722";
                } else if (o.key === "Warehouse - For Loading") {
                    o.color = "#FF5722";
                } else if (o.key === "Warehouse - Loadplan") {
                    o.color = "#FF5722";
                } else if (o.key === "Warehouse - Picking") {
                    o.color = "#FF5722";
                } else {
                    o.color = "#dddddd";
                }
            });
            $scope.pieData = value;
        });
    }
    //End Pie Chart


    $scope.xFunction = function() {
        return function(d) {
            return d.key;
        };
    };
    $scope.yFunction = function() {
        return function(d) {
            return d.y;
        };
    };
    $scope.descriptionFunction = function() {
        return function(d) {
            return d.key;
        }
    };
    $scope.showExportConfirm = function() {
        globalServices.exportExcel(exportObj, "PieData");
    };

    //Start Bar Chart

    function CreateTableChart(res) {

        angular.forEach(res, function(o) {
            var total = 0;
            //o.total = total;

            total += o.monday;
            total += o.tuesday;
            total += o.wednesday;
            total += o.thursday;
            total += o.friday;
            total += o.saturday;
            total += o.sunday;

            if (o.monday == null)
                o.Percentmonday = 0;
            if (o.tuesday == null)
                o.Percenttuesday = 0;
            if (o.wednesday == null)
                o.Percentwednesday = 0;
            if (o.thursday == null)
                o.Percentthursday = 0;
            if (o.friday == null)
                o.Percentfriday = 0;
            if (o.saturday == null)
                o.Percentsaturday = 0;
            if (o.sunday == null)

                o.Percentsunday = 0;
            if (o.monday !== 0)
                o.Percentmonday = ((o.monday / total) * 100).toFixed(2);
            if (o.tuesday !== 0)
                o.Percenttuesday = ((o.tuesday / total) * 100).toFixed(2);
            if (o.wednesday !== 0)
                o.Percentwednesday = ((o.wednesday / total) * 100).toFixed(2);
            if (o.thursday !== 0)
                o.Percentthursday = ((o.thursday / total) * 100).toFixed(2);
            if (o.friday !== 0)
                o.Percentfriday = ((o.friday / total) * 100).toFixed(2);
            if (o.saturday !== 0)
                o.Percentsaturday = ((o.saturday / total) * 100).toFixed(2);
            if (o.sunday !== 0)
                o.Percentsunday = ((o.sunday / total) * 100).toFixed(2);
        });

        var totalObj = {
            "groupName": "Total",
            "Percentmonday": 100,
            "Percenttuesday": 100,
            "Percentwednesday": 100,
            "Percentthursday": 100,
            "Percentfriday": 100,
            "Percentsaturday": 100,
            "Percentsunday": 100
        };

        res.push(totalObj);
        $scope.tableData = [].concat(res);
        //console.log($scope.tableData);
    }

    $scope.onReorder = function(order) {
        //console.log("Scope Order: " + $scope.query.order);
        //console.log("Order: " + order);
    };

    var exportBarChart = {};

    $scope.getBarChart = function(payload) {
        $scope.loading = true;
        service.getBarChart(payload).then(function(res) {
            //console.log(res);
            exportBarChart = res;

            $scope.multipleBarChartData = [];

            angular.forEach(res, function(o) {
                $scope.multipleBarChartData.push({
                    key: o.groupName,
                    values: [
                        { x: "Monday", y: o.monday },
                        { x: "Tuesday", y: o.tuesday },
                        { x: "Wednesday", y: o.wednesday },
                        { x: "Thursday", y: o.thursday },
                        { x: "Friday", y: o.friday },
                        { x: "Saturday", y: o.saturday },
                        { x: "Sunday", y: o.sunday }
                    ]
                });
            });

            $scope.barChartData = [];
            angular.forEach(res, function(o) {

                $scope.barChartData.push({
                    key: o.groupName,
                    values: [
                        ["Monday", o.monday],
                        ["Tuesday", o.tuesday],
                        ["Wednesday", o.wednesday],
                        ["Thursday", o.thursday],
                        ["Friday", o.friday],
                        ["Saturday", o.saturday],
                        ["Sunday", o.sunday]
                    ]
                });
            });

            CreateTableChart(res);

            $scope.loading = false;
        });
    };

    $scope.showExportBarChart = function() {
        globalServices.exportExcel(exportBarChart, "MultipleBarChartData");
    };
    $scope.showExportTableChart = function() {
        globalServices.exportExcel($scope.tableData, "TableChartData");
    };

    function changeColor() {
        //var elms = document.getElementsByClassName("nv-group>nv-bar");
        var elms = document.getElementsByTagName("rect");
        //var elms = angular.element(elmsRec).css("fill");
        //console.log(elms);
        Array.prototype.forEach.call(elms, function(elm) {
            var clr = elm.style.fill || "";
            clr = clr.replace(/\s/g, "").toLowerCase();
            if (clr == "rgb(31,119,180)" || clr == "rgb(174,199,232)") {
                angular.element(elm).addClass('bar-css');
                //console.log(clr);
                //console.log(elm);
            } else {
                //angular.element(elm).removeClass('bar-css');
            }
        });
    }

    var colorArray = [
        '#FFEB3B', '#FFEB3B', '#FFEB3B', '#FFEB3B',
        '#4CAF50', '#4CAF50', 
        '#FF5722', '#FF5722', '#FF5722', '#FF5722'];
 
    $scope.options = {
        chart: {
            type: 'multiBarChart',
            color: function(d, i) { 
                //console.log(d, i, colorArray[i]);
                return colorArray[i];
            },
            height: 550,
            margin: {
                top: 30,
                right: 20,
                bottom: 45,
                left: 100
            },
            padding: {
                top: 20
            },
            clipEdge: true,
            duration: 500,
            stacked: true,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -20,
                tickFormat: function(d) {
                    return d3.format(',.1f')(d);
                }
            },
            legend: {
                dispatch: {
                    legendClick: function(e) {},
                    legendDblclick: function(e) {},
                    legendMouseover: function(e) {},
                    legendMouseout: function(e) {},
                    stateChange: function(e) {
                        $scope.colorScheme = [].concat(e.disabled);
                        //console.log($scope.colorScheme);
                    }
                }
            }
        }
    };

    $scope.options2 = {
        chart: {
            showLegend: false,
            type: 'multiBarChart',
            color: function(d, i) { 
                //console.log(d, i, colorArray[i]);
                return colorArray[i];
            },
            height: 550,
            margin: {
                top: 30,
                right: 20,
                bottom: 45,
                left: 100
            },
            padding: {
                top: 20
            },
            clipEdge: true,
            duration: 500,
            stacked: true,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -20,
                tickFormat: function(d) {
                    return d3.format(',.1f')(d);
                }
            },
            legend: {
                dispatch: {
                    legendClick: function(e) {},
                    legendDblclick: function(e) {},
                    legendMouseover: function(e) {},
                    legendMouseout: function(e) {},
                    stateChange: function(e) {
                        $scope.disabledItems = e;
                        //changeColor();
                    }
                }
            }
        }
    };


    //End Bar Chart


}
