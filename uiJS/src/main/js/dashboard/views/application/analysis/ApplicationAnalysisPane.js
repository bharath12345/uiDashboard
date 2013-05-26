define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/nls/dashboard", "dashboard/logger/Logger",
    "dashboard/abstract/AbstractAnalysisPane", "dashboard/views/application/forms/AppComponentSummaryForm",
    "dashboard/views/application/forms/AppSummaryForm", "dashboard/views/application/forms/AppTopologyForm",
    "dashboard/views/application/forms/AppTransactionSummaryForm"],

    function (declare, i18n, i18nString, Logger, AbstractAnalysisPane, AppComponentSummaryForm, AppSummaryForm,
              AppTopologyForm, AppTransactionSummaryForm) {

        dashboard.classnames.ApplicationAnalysisPane = "dashboard.analysis.ApplicationAnalysisPane";

        var ApplicationAnalysisPane = declare(dashboard.classnames.ApplicationAnalysisPane, AbstractAnalysisPane, {

            pageType: dashboard.pageTypes.APPLICATION, // this is the default; in case of 'main' dashboard calls, this is overwritten in the constructor

            launch: function(id) {
                this.tabList = [];
                this.tabList.push(new AppSummaryForm(this.pageType));
                this.tabList.push(new AppTopologyForm(this.pageType));
                this.tabList.push(new AppTransactionSummaryForm(this.pageType));
                this.tabList.push(new AppComponentSummaryForm(this.pageType));
            }

        });

        ApplicationAnalysisPane.LOG = Logger.addTimer(new Logger(dashboard.classnames.ApplicationAnalysisPane));

        return ApplicationAnalysisPane;
    });