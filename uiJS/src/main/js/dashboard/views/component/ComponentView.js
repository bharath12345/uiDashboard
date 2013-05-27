define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/component/nls/component",
    "dojo/on", "dojo/_base/lang",
    "dashboard/abstract/AbstractView", "dashboard/helper/WindowManager", "dashboard/helper/ButtonHelper",
    "dashboard/helper/Scheduler"],

    function (declare, i18n, i18nString, on, lang, AbstractView, WindowManager, ButtonHelper, Scheduler) {

        dashboard.classnames.ComponentView = "dashboard.component.ComponentView";

        var ComponentView = declare("dashboard.component.ComponentView", AbstractView, {

            newWindow: false,

            constructor: function(newWindow) {
                this.newWindow = newWindow;
            },

            // the method is called only in a NEW Window. Never in the 'central' dashboard
            createDom: function() {
                this.createInnerMenuAndPanes(dashboard.dom.CpTopCenter.domNode, dashboard.pageTypes.COMPONENT);
            },

            refreshView: function() {
                var componentAccordion = ComponentView.ACCORDION;
                componentAccordion.createView(ComponentView.ID, ComponentView.NAME, ComponentView.TYPE, this.newWindow);
            },

            /*
             Button can be created at multiple levels -
             a) At the view level (which happens below)
             b) At the Form or it its inheritance hierarchy
             */
            createToolbarButtons: function(id, name, type) {
                ComponentView.ID = id;
                ComponentView.NAME = name;
                ComponentView.TYPE = type;

                /*
                 The destory of the previous toolbar happens ONLY in the view - never in the form or form's inheritance hierarchy
                 */
                dashboard.dom.Toolbar[this.pageType].destroyDescendants(false);
            },

            setAccordion: function(componentAccordion) {
                ComponentView.ACCORDION = componentAccordion;
            }
        });

        ComponentView.ACCORDION = null;

        return ComponentView;
    });