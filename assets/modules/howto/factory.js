"use strict";

goApp.factory("HowToFactory", [
    "$http", "$q", "$sce",
    function ($http, $q, $sce) {

        return {

            getHtvList: function () {

                return [{
                    title: "How to transfer css assignments to multiple customer code",
                    tags: ["transfer account", "css assignment"],
                    description: "Transfer CSS Assignments to a multiple selected customer codes with their category assignments (source warehouse)",
                    module: "Transfer Account",
                    config: {
                        preload: "none",
                        sources: [
                            { src: $sce.trustAsResourceUrl("public/video/how-to-cancel-loadplan.mp4"), type: "video/mp4" }
                        ],
                        plugins: {
                            poster: "public/img/videogular.png"
                        }
                    }
                }, {
                    title: "002",
                    tags: ["customer"],
                    description: "lorem ipsum",
                    module: "Customer Maintenance",
                    config: {
                        preload: "none",
                        sources: [
                            { src: $sce.trustAsResourceUrl("public/video/how-to-reject-consolidation.mp4"), type: "video/mp4" }
                        ],
                        plugins: {
                            poster: "public/img/videogular.png"
                        }
                    }
                }];
            }

        };

    }
]);
