define(["dojo/_base/declare", "dojo/_base/lang", 'crossroads', 'dashboard/logger/Logger', "dashboard/helper/Helper"],

    function (declare, lang, crossroads, Logger, Helper) {

        dashboard.classnames.DashboardRoutes = "dashboard.DashboardRoutes";

        var DashboardRoutes = declare(dashboard.classnames.DashboardRoutes, null, {

            loadMainPage:function () {
                require(['dashboard/DashboardView', 'dashboard/DashboardAccordion', "dashboard/views/application/ApplicationAccordion"],

                    function (DashboardView, DashboardAccordion, ApplicationAccordion) {

                        /*
                         Include Google closure's required modules
                         */


                        console.log("Staring A1 Dashboard");

                        var dView = new DashboardView();
                        dView.createDom();

                        Helper.showLoading();

                        var ca = new DashboardAccordion();
                        ca.loadAccordion();


                    }
                );
            },

            loadCrossRoadRoutes:function () {

                dashboard.enumMap = {};


                var hashString = document.URL.substring(document.URL.indexOf("#") + 1, document.URL.length);
                console.log("hash string = " + hashString);

                crossroads.routed.add(console.log, console); //log all routes
                crossroads.bypassed.add(console.log, console); //log all requests that were bypassed

                dashboard.routes.push(crossroads.addRoute('/application/:uuid:/:enumid:/:name:/:type:', lang.hitch(this, this.applicationMatch)));
                dashboard.routes.push(crossroads.addRoute('/config/:uuid:/:enumid:/:name:/:type:', lang.hitch(this, this.configMatch)));
                dashboard.routes.push(crossroads.addRoute('/topology/:uuid:/:enumid:/:name:/:type:', lang.hitch(this, this.topologyMatch)));
                dashboard.routes.push(crossroads.addRoute('/custom/:uuid:/:enumid:/:name:/:type:', lang.hitch(this, this.customMatch)));
                dashboard.routes.push(crossroads.addRoute('/analytics/:uuid:/:enumid:/:name:/:type:', lang.hitch(this, this.analyticsMatch)));

                crossroads.parse(hashString);

            },

            applicationMatch:function (uuid, enumid, name, type) {
                console.log("APPLICATION - Name = " + name + " type = " + type + " uuid = " + uuid + " enumid = " + enumid);

                require(["dashboard/views/application/ApplicationUtility", "dashboard/views/application/ApplicationAccordion"],
                    function (ApplicationUtility, ApplicationAccordion) {
                        Logger.initialize();
                        ApplicationUtility.InitKeyControls();

                        dashboard.enumMap.APPLICATION = {};
                        dashboard.enumMap.APPLICATION[name] = parseInt(enumid);

                        var applicationAccordion = new ApplicationAccordion();
                        DashboardRoutes.createDomAndShowPage(applicationAccordion, enumid, uuid, name, type);
                    }
                );
            },

            configMatch: function(uuid, enumid, name, type) {
                console.log("CONFIG - Name = " + name + " type = " + type + " uuid = " + uuid + " enumid = " + enumid);

                require(['dashboard/config/ConfigAccordion'],
                    function (ConfigAccordion) {
                        dashboard.enumMap.CONFIG = {};
                        dashboard.enumMap.CONFIG[name] = parseInt(enumid);

                        var configAccordion = new ConfigAccordion();
                        DashboardRoutes.createDomAndShowPage(configAccordion, enumid, uuid, name, type);
                    }
                );
            },

            topologyMatch: function(uuid, enumid, name, type) {
                console.log("TOPOLOGY - Name = " + name + " type = " + type + " uuid = " + uuid + " enumid = " + enumid);

                require(["dashboard/views/topology/TopologyAccordion"],

                    function (TopologyAccordion) {
                        dashboard.enumMap.TOPOLOGY = {};
                        dashboard.enumMap.TOPOLOGY[name] = parseInt(enumid);

                        var topoAccordion = new TopologyAccordion();
                        DashboardRoutes.createDomAndShowPage(topoAccordion, enumid, uuid, name, type);
                    });
            },

            customMatch: function(uuid, enumid, name, type) {
                console.log("CUSTOM - Name = " + name + " type = " + type + " uuid = " + uuid + " enumid = " + enumid);

                require(["dashboard/views/custom/CustomAccordion"],
                    function (CustomAccordion) {
                        dashboard.enumMap.CUSTOM = {};
                        dashboard.enumMap.CUSTOM[name] = parseInt(enumid);

                        var customAccordion = new CustomAccordion();
                        DashboardRoutes.createDomAndShowPage(customAccordion, enumid, uuid, name, type);
                    }
                );
            },

            analyticsMatch: function(uuid, enumid, name, type) {
                console.log("Analytics - Name = " + name + " type = " + type + " uuid = " + uuid + " enumid = " + enumid);

                require(["dashboard/views/analytics/AnalyticsAccordion"],
                    function (AnalyticsAccordion) {
                        dashboard.enumMap.ANALYTICS = {};
                        dashboard.enumMap.ANALYTICS[name] = parseInt(enumid);

                        var analyticsAccordion = new AnalyticsAccordion();
                        DashboardRoutes.createDomAndShowPage(analyticsAccordion, enumid, uuid, name, type);
                    }
                );
            }
        });

        DashboardRoutes.createDomAndShowPage = function(accordionObject, enumid, uuid, name, type) {
            var viewObject = accordionObject.getView(name, true);
            viewObject.createDom();
            Helper.showLoading();
            accordionObject.showView(enumid, uuid, name, type, true);
        };

        DashboardRoutes.LOG = Logger.addTimer(new Logger(dashboard.classnames.DashboardRoutes));

        return DashboardRoutes;
    }
);