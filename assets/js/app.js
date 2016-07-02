"use strict";
var goApp = angular.module("goApp", [
    "ngMaterial"
    , "ngAnimate"
    , "ngSanitize"
    , "ui.router"
    , "ngMessages"
    , "ngResource"
    , "md.data.table"
    , "LocalStorageModule"
    , "yaru22.angular-timeago"
    , "nvd3"
    , "com.2fdevs.videogular"
    , "com.2fdevs.videogular.plugins.controls"
    , "com.2fdevs.videogular.plugins.overlayplay"
    , "com.2fdevs.videogular.plugins.poster"
    , "com.2fdevs.videogular.plugins.buffering"
]);
goApp.run(["$rootScope", "$state", "$stateParams", "$templateCache", "AuthenticationFactory", 
    function($rootScope, $state, $stateParams, $templateCache, auth) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    //auth.fillAuthData();
}]);
