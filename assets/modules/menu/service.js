"use strict";

goApp.service("MainService", ["$q", MainService]);

/**
 * Menu DataService
 * Uses embedded, hard-coded data model; acts asynchronously to simulate
 * remote data service call(s).
 *
 * @returns {{loadAll: Function}}
 * @constructor
 */
function MainService($q) {

    var menu = [{
        name: "Home",
        avatar: "assets/svg/dripicons/home.svg",
        url: "main.home",
        content: "#/main/home",
    }, {
        name: "Dashboard",
        avatar: "assets/svg/dripicons/graph-line.svg",
        url: "main.dashboard",
        content: "#/main/dashboard"
    }
    , {
        name: "A: Preparation of LoadPlan",
        avatar: "assets/svg/dripicons/calendar.svg",
        url: "main.loadplan",
        content: "#/main/loadplan"
    }, {
        name: "B: Start of Warehouse Picking",
        avatar: "assets/svg/dripicons/document-edit.svg",
        url: "main.warehouse_picking",
         content: "#/main/warehouse_picking"
    }, {
        name: "C: Checking or Consolidation",
        avatar: "assets/svg/dripicons/document.svg",
        url: "main.checking_consolidation",
        content: "#/main/checking_consolidation"
    }, {
        name: "D: Loading to Trucks",
        avatar: "assets/svg/dripicons/download.svg",
        url: "main.loading_trucks",
        content: "#/main/loading_trucks"
    }, {
        name: "PO Activity",
        avatar: "assets/svg/dripicons/help.svg",
        url: "main.po_activity",
        content: "#/main/po_activity"
    }, {
        name: "Chain Maintenance",
        avatar: "assets/svg/dripicons/link.svg",
        url: "main.chain",
        content: "#/main/chain"
    // },  {
    //     name: "Trucker SMS Logs Report",
    //     avatar: "assets/svg/dripicons/message.svg",
    //     url: "main.report_trucker_logs",
    //     content: "#/main/report_trucker_logs"
    }, {
        name: "How to Videos",
        avatar: "assets/svg/dripicons/question.svg",
        url: "main.howto",
        content: "#/main/howto"
    }
//    , {
//        name: "Reports",
//        avatar: "assets/svg/dripicons/graph-pie.svg",
//        url: "main.reports",
//        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, accusantium ab alias aliquid accusamus labore in earum sit aliquam beatae aut, maiores eveniet delectus blanditiis animi neque! Eveniet, fugiat, laboriosam."
//    }
//    , {
//        name: "Users",
//        avatar: "assets/svg/dripicons/user.svg",
//        url: "main.users",
//        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, unde ullam totam nostrum. Odit eligendi, vel itaque repellat saepe, ullam laudantium eaque doloremque, hic adipisci voluptatem modi, beatae repellendus vitae!"
//    }
    ];

    // Promise-based API
    return {
        loadAllMenus: function() {
            // Simulate async nature of real remote calls
            return $q.when(menu);
        }
    };
}
