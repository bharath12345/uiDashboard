define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/topology/nls/topology", "dojo/i18n!dashboard/nls/dashboard", "dashboard/logger/Logger",
    "dashboard/abstract/AbstractAccordion", "dashboard/helper/Scheduler", "dashboard/views/transaction/TransactionView", "dashboard/helper/Helper"],

    function (declare, i18n, i18nString, dashboardI18nString, Logger, AbstractAccordion, Scheduler, TransactionView, Helper) {

        dashboard.classnames.TransactionAccordion = "dashboard.transaction.TransactionAccordion";

        var TransactionAccordion = declare(dashboard.classnames.TransactionAccordion, AbstractAccordion, {

            showView: function(enumId, uuid, name, type, newWindow) {
                console.log("view id = " + enumId + " name = " + name + " uuid = " + uuid + " type = " + type);

                var transactionView = this.getView(name);
                transactionView.createToolbarButtons(enumId, uuid, name, type);

                switch(parseInt(enumId)) {
                    case dashboard.enumMap.TRANSACTION.TRANSACTION_LAYOUTS:
                        break;

                    case this.dashboard.enumMap.TRANSACTION.TRANSACTION_VIEWS:
                        break;

                    default:
                        console.log("Unknown page id = " + enumId);
                        return;
                }
            },

            getView: function(name, newWindow) {
                var transactionView = TransactionAccordion.VIEWMAP[name];
                if(transactionView == null) {
                    transactionView = new TransactionView(newWindow);
                    transactionView.setAccordion(this);
                    TransactionAccordion.VIEWMAP[name] = transactionView; // there should be only one view per name (filtered views are for later)
                }
                return transactionView;
            }
        });

        TransactionAccordion.LOG = Logger.addTimer(new Logger(dashboard.classnames.TransactionAccordion));

        TransactionAccordion.VIEWMAP = {};

        return TransactionAccordion;
    });