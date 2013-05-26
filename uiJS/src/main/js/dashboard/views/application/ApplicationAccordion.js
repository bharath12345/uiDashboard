define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/application/nls/application",  "dojo/i18n!dashboard/nls/dashboard",
    "dashboard/logger/Logger", "dojo/_base/lang",
    "dashboard/abstract/AbstractAccordion", "dashboard/views/application/ApplicationView", "dashboard/helper/Scheduler", "dashboard/helper/Helper"],

    function (declare, i18n, i18nString, dashboardI18nString, Logger, lang, AbstractAccordion, ApplicationView, Scheduler, Helper) {

        dashboard.classnames.ApplicationAccordion = "dashboard.application.ApplicationAccordion";

        var ApplicationAccordion = declare(dashboard.classnames.ApplicationAccordion, AbstractAccordion, {

            showView: function(enumId, uuid, name, type, newWindow) {
                console.log("view id = " + enumId + " name = " + name + " uuid = " + uuid + " type = " + type);

                this.applicationView = this.getView(name, newWindow);
                this.applicationView.createToolbarButtons(enumId, uuid, name, type);

                switch(parseInt(enumId)) {
                    case dashboard.enumMap.APPLICATION.APPLICATION_ALERTS:
                        require(["dashboard/views/application/forms/ApplicationApplicationIncidentForm"], lang.hitch(this, function (ApplicationApplicationIncidentForm) {
                            Helper.createView(this.applicationView, this.applicationView.pageType, new ApplicationApplicationIncidentForm(this.applicationView.pageType));
                        }));
                        break;

                    case dashboard.enumMap.APPLICATION.TRANSACTION_GRID:
                        require(["dashboard/views/application/forms/ApplicationTransactionGridForm"], lang.hitch(this, function (ApplicationTransactionGridForm) {
                            Helper.createView(this.applicationView, this.applicationView.pageType, new ApplicationTransactionGridForm(this.applicationView.pageType));
                        }));
                        break;

                    default:
                        console.log("Unknown page id = " + enumId + " name = " + name);
                        return;
                }

            },

            /*
                Per the current design, one Accordion holds only one ACTIVE VIEW
                but later for faster loading, we can keep a list of views per accordion and load them instantly
             */
            getView: function(name, newWindow) {
                if(this.applicationView == null || this.applicationView == undefined) {
                    this.applicationView = new ApplicationView(newWindow);
                    this.applicationView.setAccordion(this);
                }
                return this.applicationView;
            }
        });

        ApplicationAccordion.LOG = Logger.addTimer(new Logger(dashboard.classnames.ApplicationAccordion));

        return ApplicationAccordion;
    });