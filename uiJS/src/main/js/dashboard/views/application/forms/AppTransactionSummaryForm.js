define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/nls/dashboard", "dashboard/logger/Logger",
    "dashboard/views/application/abstract/AppForm"],

    function (declare, i18n, i18nString, Logger, AppForm) {

        dashboard.classnames.AppTransactionSummaryForm = "dashboard.application.forms.application.AppTransactionSummaryForm";

        var AppTransactionSummaryForm = declare(dashboard.classnames.AppTransactionSummaryForm, AppForm, {

            title: "Transaction Summary",
            inAnalysisPane: true,

            createToolbarButtons: function() {
            },

            launch: function() {

            }

        });

        AppTransactionSummaryForm.LOG = Logger.addTimer(new Logger(dashboard.classnames.AppTransactionSummaryForm));

        return AppTransactionSummaryForm;
    });