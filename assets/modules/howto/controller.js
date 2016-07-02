"use strict";
goApp.controller("HowToController", [
    "$scope", "HowToFactory", "$sce", "$timeout",
    function($scope, f, $sce, $timeout) {

        var controller = this;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;

        controller.onPlayerReady = function(API) {
            controller.API = API;
        };

        controller.onCompleteVideo = function() {
            controller.isCompleted = true;

            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

            controller.setVideo(controller.currentVideo);
        };

        controller.videos = [
        {
            sources: [
                {   
                    title: "How to Cancel Loadplan", 
                    description: "Cancel loadplan individual or batch",
                    src: $sce.trustAsResourceUrl("public/video/how-to-cancel-loadplan.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How to Reject Consolidation", 
                    description: "Reject Consolidation individual",
                    src: $sce.trustAsResourceUrl("public/video/how-to-reject-consolidation.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How to Reject Loading to Truck", 
                    description: "Reject Loading to Truck individual",
                    src: $sce.trustAsResourceUrl("public/video/how-to-reject-loadingtotruck.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How to Reject Picking", 
                    description: "Reject Warehouse Picking individual",
                    src: $sce.trustAsResourceUrl("public/video/how-to-reject-picking.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How to Use PO Activity", 
                    description: "Explore PO Activity",
                    src: $sce.trustAsResourceUrl("public/video/how-to-use-po-activity.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How Add Chain Code", 
                    description: "Adding Chain Code has never been easy.",
                    src: $sce.trustAsResourceUrl("public/video/HowAddChainCode.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Batch Cancel Loadplan", 
                    description: "Batch Cancelling Truck Allocation in Loadplan.",
                    src: $sce.trustAsResourceUrl("public/video/HowToBatchCancelLoadplan.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Confirm Loading To Truck", 
                    description: "Invidual Confirmation of Ttruck Allocation in Loading to Truck module.",
                    src: $sce.trustAsResourceUrl("public/video/HowToConfirmLoadingToTruck.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Confirm Loadplan", 
                    description: "Batch Confirmation of Ttruck Allocation in Loadplan module.",
                    src: $sce.trustAsResourceUrl("public/video/HowToConfirmLoadplan.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Consolidate TA", 
                    description: "Individual Consolidation of Ttruck Allocation in Checking & Consolidation module.",
                    src: $sce.trustAsResourceUrl("public/video/HowToConsolidateTA.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Delete Chain Code", 
                    description: "Deleting record of chain code.",
                    src: $sce.trustAsResourceUrl("public/video/HowToDeleteChain.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Edit Chain Code Information", 
                    description: "Updating record of chain code.",
                    src: $sce.trustAsResourceUrl("public/video/HowToEditChain.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Export Chain Code List", 
                    description: "Exporting Chain Code list",
                    src: $sce.trustAsResourceUrl("public/video/HowToExportChain.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Filter Chain", 
                    description: "Quick Filter Search from Chain Code list",
                    src: $sce.trustAsResourceUrl("public/video/HowToFilterChain.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Pick TA in Warehouse Picking", 
                    description: "Individual Picking Truck Allocation in Warehouse Picking module.",
                    src: $sce.trustAsResourceUrl("public/video/HowToPickTAinWarehousePicking.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Search Chain", 
                    description: "Searching Chain Code with multiple clause in Chain maintenance.",
                    src: $sce.trustAsResourceUrl("public/video/HowToSearchChain.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Use Chat", 
                    description: "Using chat feature will connect from loading to picking or from consolidation to loading to truck.",
                    src: $sce.trustAsResourceUrl("public/video/HowToUseChat.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To Use Dashboard", 
                    description: "Dashboard monitoring in bar chart and pie chart.",
                    src: $sce.trustAsResourceUrl("public/video/HowToUseDashboard.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To View Activty Stream", 
                    description: "Viewing Activity Stream.",
                    src: $sce.trustAsResourceUrl("public/video/HowToViewActivtyStream.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }, {
            sources: [
                {   
                    title: "How To View SMS", 
                    description: "Viewing Trucker SMS.",
                    src: $sce.trustAsResourceUrl("public/video/HowToViewSMS.mp4"), 
                    type: "video/mp4" 
                }
            ]
        }
        ];


        controller.currentVideoTitle = controller.videos[0].sources[0].title;

        controller.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false,
            sources: controller.videos[0].sources,
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                poster: "public/img/videogular.png"
            }
        };

        controller.setVideo = function(index) {
            console.log(index);
            controller.currentVideoTitle = controller.videos[index].sources[0].title;

            controller.API.stop();
            controller.currentVideo = index;
            controller.config.sources = controller.videos[index].sources;
            $timeout(controller.API.play.bind(controller.API), 100);
        };
    }
]);
