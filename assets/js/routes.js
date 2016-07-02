"use strict";
goApp.config(function($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    //$httpProvider.interceptors.push("authInterceptorService");

    // $httpProvider.defaults.headers.common = {};
    // $httpProvider.defaults.headers.post = {};
    // $httpProvider.defaults.headers.put = {};
    // $httpProvider.defaults.headers.patch = {};

    // $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
    // $httpProvider.defaults.headers.post["Content-Type"] =  "application/x-www-form-urlencoded";

    //$urlRouterProvider.otherwise("/404");
    $stateProvider
        .state("login", {
            url: "/login",
            controller: "LoginController",
            templateUrl: "assets/modules/login/page.html"
        })
        .state("404", {
            url: "/404",
            templateUrl: "assets/modules/error/page.html"
        })
        .state("main", {
            url: "/main",
            controller: "MainController",
            templateUrl: "assets/modules/menu/page.html"
        })
        .state("main.home", {
            url: "/home",
            controller: "HomeController",
            templateUrl: "assets/modules/home/page.html"
        })
        .state("main.users", {
            url: "/users",
            controller: "UserController",
            templateUrl: "assets/modules/users/page.html"
        })
        .state("main.dashboard", {
            url: "/dashboard",
            controller: "DashboardController",
            templateUrl: "assets/modules/dashboard/page.html"
        })
        .state("main.po_activity", {
            url: "/po_activity",
            controller: "PoActivityController",
            templateUrl: "assets/modules/po-activity/page.html"
        })
        .state("main.chain", {
            url: "/chain",
            controller: "ChainController",
            templateUrl: "assets/modules/chain/page.html"
        })
        .state("main.howto", {
            url: "/howto",
            controller: "HowToController",
            templateUrl: "assets/modules/howto/page.html"
        });

    $mdIconProvider
        .defaultIconSet("assets/svg/avatars.svg", 128)
        .icon("menu", "assets/svg/menu.svg", 24)
        .icon("share", "assets/svg/share.svg", 15)
        .icon("google_plus", "assets/svg/google_plus.svg", 24)
        .icon("hangouts", "assets/svg/hangouts.svg", 24)
        .icon("twitter", "assets/svg/twitter.svg", 24)
        .icon("phone", "assets/svg/phone.svg", 24)

        .icon("chat", "assets/svg/dripicons/message.svg", 20)
        .icon("close", "assets/svg/dripicons/cross.svg", 15)
        .icon("user", "assets/svg/dripicons/user.svg", 24);

    //red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey

    $mdThemingProvider.theme("default")
        .primaryPalette("teal")
        .accentPalette("amber");

});
