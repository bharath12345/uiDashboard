define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/nls/dashboard", "dojo/i18n!dashboard/views/analytics/nls/analytics",
    "dashboard/logger/Logger", "dashboard/views/analytics/abstract/AnalyticsForm", "dojo/dom-construct",
    "dashboard/helper/Helper", "dojo/request/xhr", "dojo/_base/lang", 'dashboard/widgets/AoneDgrid'],

    function (declare, i18n, dashboardI18nString, i18nString, Logger, AnalyticsForm, domConstruct, Helper, xhr, lang, Grid) {

        dashboard.classnames.SqlDBOutliersKPIGridForm = "dashboard.analytics.forms.SqlDBOutliersKPIGridForm";

        var SqlDBOutliersKPIGridForm = declare(dashboard.classnames.SqlDBOutliersKPIGridForm, AnalyticsForm, {

            title: "Violated DB KPI",
            pageType: dashboard.pageTypes.ANALYTICS, // this is the default; in case of 'main' dashboard calls, this is overwritten in the constructor
            inAnalysisPane: true,

            startup:function () {
                this.inherited(arguments);
            },

            createToolbarButtons: function() {
            },

            launch: function() {

                this.innerDIV = domConstruct.create('div', {style:'width: 100%; height: 100%;'});
                this.attr('content', this.innerDIV);

                var viewMeta = {
                    id: this.selectedId
                };xhr("analytics/sqlAnalyticsViolatedKPI.action", {
                    handleAs:"json",
                    method:"POST",
                    query:viewMeta,
                    headers:Helper.JSON_HEADER
                }).then(lang.hitch(this, this.createGridMeta));
            },

            createGridMeta:function (input) {

                var data = input.sqlQueryOutlierViolatedKpiVO.violatedDbKpis;
                var columnMeta = [{
                    field:"kpiName",
                    label:"KPI Name",
                    resizable:true
                },{
                    field:"id",
                    label:"id",
                    unhidable:true,
                    hidden:true
                }];

                // create one blank grid data row
                var gridata = [];
                for (var i = 0; i < data.length; i++) {
                    var row = {};
                    row.kpiName = data[i];
                    row.id = input.sqlQueryOutlierViolatedKpiVO.id;
                    gridata.push(row);
                }

                try {

                    SqlDBOutliersKPIGridForm.Grid = new Grid();
                    SqlDBOutliersKPIGridForm.Grid.setColumnMeta(columnMeta);
                    SqlDBOutliersKPIGridForm.Grid.setData(gridata);
                    SqlDBOutliersKPIGridForm.Grid.render(this.innerDIV);
                    SqlDBOutliersKPIGridForm.Grid.handleRowClick(this); // the handleRowClick() callback is invoked in this case

                } catch (e) {
                    console.log("exception = " + e);
                }

            }

        });

        SqlDBOutliersKPIGridForm.LOG = Logger.addTimer(new Logger(dashboard.classnames.SqlDBOutliersKPIGridForm));

        return SqlDBOutliersKPIGridForm;
    });