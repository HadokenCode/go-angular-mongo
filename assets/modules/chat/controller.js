"use strict";
goApp.controller("ChatController",
    ["$scope", "ChatFactory", "$timeout", "$mdSidenav", "$log", "$window", "AuthenticationFactory",
        function ($scope, factory, $timeout, $mdSidenav, $log, $window, authData) {

            var primaryList = [];

            factory.getPrimaryImage().then(function(result) {
                primaryList = result;
            });

            /*SignalR Implementation*/
           

            //Activity Stream
            var activityStreamHub = connection.createHubProxy("activityStreamHub");
            var sendActivityData = function (value) {
                activityStreamHub.invoke("sendActivityData", value)
                    .done(function () { })
                    .fail(function () { });
            }
            activityStreamHub.on("receiveActivityData", function (value) {
                angular.forEach(value, function(o){
                    o.color=Math.floor(Math.random()*16777215).toString(16);
                });
                $scope.activities = value;
            });

            //Trucker SMS
            var truckerSmsHub = connection.createHubProxy("truckerSmsHub");
            var sendSmsData = function (value) {
                truckerSmsHub.invoke("sendSmsData", value)
                    .done(function () { })
                    .fail(function () { });
            }
            truckerSmsHub.on("receiveSmsData", function (value) {
                $scope.truckerMessages = value;
            });

            connection.start()
                .done(function() {
                    sendActivityData({});
                    sendSmsData({});
                })
                .fail(function() {});
            /*End SignalR Implementation*/
            const auth = authData.authData;
            $scope.userName = auth.userDetails[1];
            $scope.primaryPic = auth.userDetails[4];

            $scope.messages = [];

            factory.getMessage().then(function(result) {
                angular.forEach(result, function(message) {
                    message = {
                        User: message.user,
                        Message: message.message,
                        DateTime: message.dateTime
                    };
                    angular.forEach(primaryList, function(o){
                        if(o.userName === message.User){
                            //console.log(message.User);
                            console.log(o.primary);
                            message.PrimaryPic = o.primary;
                            return; 
                        }
                        return;
                    });
                    $scope.messages.push(message);
                });
            });

            $scope.chatMessage = "";
            $scope.sendMessage = function(message) {
                if (message == undefined || message === "") {
                    return;
                }
                const chatMessage = {
                    user: $scope.userName,
                    message: message
                };
                factory.sendMessage(chatMessage).then(function (result) {
                    sendMessage(result);
                    $scope.chatMessage = "";
                }, function() {
                    swal("Error sending message", "", "error");
                });
            };

            $scope.myFunct = function(keyEvent) {
                if (keyEvent.which === 13)
                    $scope.sendMessage($scope.chatMessage);
            };



            $scope.close = function() {
                $mdSidenav("right").close()
                    .then(function() {
                        $log.debug("close RIGHT is done");
                    });
            };
        }
    ]
);