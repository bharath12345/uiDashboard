define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/application/nls/application", "dojo/i18n!dashboard/nls/dashboard",
    "dijit/layout/ContentPane", "dojox/layout/GridContainer", 'dashboard/widgets/AoneDgrid', "dojo/request/xhr",
    "dojo/_base/lang", "dojo/store/Memory", "dojo/dom-construct",
    "dashboard/logger/Logger", "dashboard/helper/Scheduler", "dashboard/helper/Helper", "dashboard/abstract/AbstractForm"],

    function (declare, i18n, i18nString, dashboardI18nString, ContentPane, GridContainer,
              Grid, xhr, lang, Memory, domConstruct,
              Logger, Scheduler, Helper, AbstractForm) {


        /*

         */

        dashboard.classnames.JBossProtoIncidentForm = "dashboard.application.forms.JBossProtoIncidentForm";

        var JBossProtoIncidentForm = declare(dashboard.classnames.JBossProtoIncidentForm, AbstractForm, {

            title: dashboardI18nString.JBOSS_PROTO_ALERTS,
            inAnalysisPane: false,
            pageType: dashboard.pageTypes.APPLICATION, // this is the default; in case of 'main' dashboard calls, this is overwritten in the constructor

            createToolbarButtons: function() {
            },

            startup:function () {
                this.inherited(arguments);
            },

            launch: function() {
                this.innerDIV = domConstruct.create('div', {style:'width: 100%; height: 100%;'});
                this.attr('content', this.innerDIV);

                var viewMeta = {};
                xhr("application/RealTimeAlertMeta.action", {
                    handleAs:"json",
                    method:"POST",
                    query:viewMeta,
                    headers:Helper.JSON_HEADER
                }).then(lang.hitch(this, this.createIncidentGridMeta));
            },

            createIncidentGridMeta:function (input) {
                if (input.alertMetaVO == null || input.alertMetaVO == undefined || input.alertMetaVO.columns.length == 0) {
                    this.attr('content', "Nothing configured to display on the dashboard");
                    dashboard.dom.STANDBY.hide();
                    return;
                }
                var data = Helper.parseInput(input);
                this.createGrid(data, input);
            },

            createGrid:function (data, input) {

                var columnMeta = [];

                JBossProtoIncidentForm.DATACLASS = input.alertMetaVO.dataActionClass;

                var columns = input.alertMetaVO.columns;
                var gridata = [];
                var row = {};
                for (var i = 0; i < columns.length; i++) {
                    var col = {};
                    col.field = columns[i];
                    col.label = i18nString[columns[i]];
                    columnMeta.push(col);

                    // create blank grid row
                    row[columns[j]] = "";
                    gridata.push(row);
                }

                /*
                 ToDo: ToDo: ToDo: ToDo: todo todo todo todo todo
                 Insert blank rows
                 }*/

                try {

                    JBossProtoIncidentForm.Grid = new Grid();
                    JBossProtoIncidentForm.Grid.setColumnMeta(columnMeta);
                    JBossProtoIncidentForm.Grid.setData(gridata);
                    JBossProtoIncidentForm.Grid.render(this.innerDIV);
                    JBossProtoIncidentForm.Grid.handleRowClick(this); // the handleRowClick() callback is invoked in this case

                } catch (e) {
                    console.log("exception = " + e);
                }

            },

            handleRowClick:function (evt) {
                var row = JBossProtoIncidentForm.Grid.getRow(evt);

                // row.element == the element with the dgrid-row class
                // row.id == the identity of the item represented by the row
                // row.data == the item represented by the row

                console.log("row element = " + dojo.toJson(row.element));
                console.log("row id = " + dojo.toJson(row.id));
                console.log("row data = " + dojo.toJson(row.data));

                require(["dashboard/views/application/analysis/ApplicationAnalysisPane"], lang.hitch(this, function (ApplicationAnalysisPane) {
                    var analysisPane = new ApplicationAnalysisPane();
                    analysisPane.launch(row.data.id);
                }));
            }

        });

        // static variables of this class
        JBossProtoIncidentForm.LOG = Logger.addTimer(new Logger(dashboard.classnames.JBossProtoIncidentForm));
        JBossProtoIncidentForm.DATACLASS = null;

        return JBossProtoIncidentForm;
    });