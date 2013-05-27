define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/topology/nls/topology", "dojo/i18n!dashboard/nls/dashboard", "dashboard/logger/Logger",
    "dashboard/abstract/AbstractAccordion", "dashboard/helper/Scheduler", "dashboard/views/component/ComponentView", "dashboard/helper/Helper"],

    function (declare, i18n, i18nString, dashboardI18nString, Logger, AbstractAccordion, Scheduler, ComponentView, Helper) {

        dashboard.classnames.ComponentAccordion = "dashboard.component.ComponentAccordion";

        var ComponentAccordion = declare(dashboard.classnames.ComponentAccordion, AbstractAccordion, {

            showView: function(enumId, uuid, name, type, newWindow) {
                console.log("view id = " + enumId + " name = " + name + " uuid = " + uuid + " type = " + type);

                var componentView = this.getView(name);
                componentView.createToolbarButtons(enumId, uuid, name, type);

                switch(parseInt(enumId)) {
                    case dashboard.enumMap.COMPONENT.COMPONENT_LAYOUTS:
                        break;

                    case this.dashboard.enumMap.COMPONENT.COMPONENT_VIEWS:
                        break;

                    default:
                        console.log("Unknown page id = " + enumId);
                        return;
                }
            },

            getView: function(name, newWindow) {
                var componentView = ComponentAccordion.VIEWMAP[name];
                if(componentView == null) {
                    componentView = new ComponentView(newWindow);
                    componentView.setAccordion(this);
                    ComponentAccordion.VIEWMAP[name] = componentView; // there should be only one view per name (filtered views are for later)
                }
                return componentView;
            }
        });

        ComponentAccordion.LOG = Logger.addTimer(new Logger(dashboard.classnames.ComponentAccordion));

        ComponentAccordion.VIEWMAP = {};

        return ComponentAccordion;
    });