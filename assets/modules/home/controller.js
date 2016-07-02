"use strict";
goApp.controller("HomeController", [
    "$scope", "$window", "AuthenticationFactory",
    HomeController
]);

function HomeController($scope, $window, af) {
	var ao = af.authData;
    //var userRole = ao.userRoles[0].itemArray[1];
    var userRole = "OSR Admin";

	$scope.hasAccess = function(url){
		url = "home";
        if ( 
            (  url=="home" || 
               url=="chain" || 
               // url=="report_trucker_logs" || 
               url=="dashboard" || 
               url=="loadplan" ||  
               url=="warehouse_picking" || 
               url=="checking_consolidation" || 
               url=="loading_trucks" || 
               url=="po_activity" || url=="howto" )  && userRole=="OSR Admin"){
            return true;
    	} else if ( 
            (  url=="dashboard" || 
               url == "po_activity" || url == "howto" ) && userRole == "OSR Sales") {
            return true;
    	} else if (
            ( url == "loadplan" || url=="howto" )
                && userRole == "OSR LoadPlan") {
            return true;
    	} else if (
            ( url == "warehouse_picking" || url == "howto")
                && userRole == "OSR Picking") {
            return true;
    	} else if (
            ( url == "checking_consolidation" || url=="howto" )
                && userRole == "OSR Consolidation") {
            return true;
    	} else if (
            ( url == "loading_trucks" || url=="howto" )
            && userRole == "OSR Loading") {
            return true;
        } else {
            return false;
        }

    };

	$scope.homeList = [
		{
			name: "Dashboard",
			url: "dashboard",
			icon: "pie_chart"
		},{
			name: "Loadplan",
			url: "loadplan",
			icon: "assignment"
		},{
			name: "Picking",
			url: "warehouse_picking",
			icon: "touch_app"
		},{
			name: "Consolidation",
			url: "checking_consolidation",
			icon: "pages"
		},{
			name: "Loading to Trucks",
			url: "loading_trucks",
			icon: "airport_shuttle"
		},{
			name: "PO Activity",
			url: "po_activity",
			icon: "fitness_center"
		},{
			name: "Chain Maintenance",
			url: "chain",
			icon: "link"
		},{
			name: "Trucker SMS Logs Report",
			url: "report_trucker_logs",
			icon: "message"
		}, {
		    name: "How To",
		    url: "howto",
		    icon: "help"
		}
	];

	$scope.goToPage = function(url){
		console.log(url);
		$window.location.href = '#/main/'+url;
	};
} //end of controller