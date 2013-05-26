define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/application/nls/application", "dojo/i18n!dashboard/nls/dashboard",
    "dijit/layout/ContentPane", "dojox/layout/GridContainer", 'dashboard/widgets/AoneDgrid', "dojo/request/xhr",
    "dojo/_base/lang", "dojo/store/Memory", "dojo/dom-construct",
    "dashboard/logger/Logger", "dashboard/helper/Scheduler", "dashboard/helper/Helper", "dashboard/abstract/AbstractForm"],

    function (declare, i18n, i18nString, dashboardI18nString, ContentPane, GridContainer,
              Grid, xhr, lang, Memory, domConstruct,
              Logger, Scheduler, Helper, AbstractForm) {


        /*

         */

        dashboard.classnames.ApplicationIncidentForm = "dashboard.application.forms.ApplicationIncidentForm";

        var ApplicationIncidentForm = declare(dashboard.classnames.ApplicationIncidentForm, AbstractForm, {

            title: dashboardI18nString.APPLICATION_ALERTS,
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
                xhr("alert/ApplicationMeta.action", {
                    handleAs:"json",
                    method:"POST",
                    query:viewMeta,
                    headers:Helper.JSON_HEADER
                }).then(lang.hitch(this, this.createIncidentGridMeta));
            },

            createIncidentGridMeta:function (input) {
                if (input.applicationVO == null || input.applicationVO == undefined || input.applicationVO.applications.length == 0) {
                    this.attr('content', "No Applications configured to display on the dashboard");
                    dashboard.dom.STANDBY.hide();
                    return;
                }
                var data = Helper.parseInput(input);
                this.createGrid(data, input);
            },

            createGrid:function (data, input) {

                var columnMeta = [
                    {
                        field:"appName",
                        label:"Application Name",
                        resizable:true
                    },
                    {
                        field:"id",
                        label:"id",
                        unhidable:true,
                        hidden:true
                    }
                ];

                ApplicationIncidentForm.DATACLASS = input.applicationVO.dataActionClass;

                var metrics = input.applicationVO.metrics;
                for (var i = 0; i < metrics.length; i++) {
                    var col = {};
                    col.label = i18nString[metrics[i]];
                    //col.field = metrics[i]; // because of child columns, there is NO field
                    col.reorderable = true;
                    col.resizable = true;
                    col.children = [];

                    var subcol = {};
                    subcol.field = metrics[i] + "_" + ApplicationIncidentForm.CRITICAL;
                    subcol.label = i18nString[ApplicationIncidentForm.CRITICAL];
                    subcol.reorderable = true;
                    subcol.resizable = true;
                    col.children.push(subcol);

                    subcol = {};
                    subcol.field = metrics[i] + "_" + ApplicationIncidentForm.MAJOR;
                    subcol.label = i18nString[ApplicationIncidentForm.MAJOR];
                    subcol.reorderable = true;
                    subcol.resizable = true;
                    col.children.push(subcol);

                    subcol = {};
                    subcol.field = metrics[i] + "_" + ApplicationIncidentForm.MINOR;
                    subcol.label = i18nString[ApplicationIncidentForm.MINOR];
                    subcol.reorderable = true;
                    subcol.resizable = true;
                    col.children.push(subcol);

                    columnMeta.push(col);
                }


                // create blank grid
                var gridata = [];
                for (var i = 0; i < input.applicationVO.applications.length; i++) {
                    var row = {};
                    var apps = input.applicationVO.applications;
                    row.appName = apps[i].name;
                    row.id = apps[i].id;
                    for (var j = 0; j < metrics.length; j++) {
                        row[metrics[j] + "_" + ApplicationIncidentForm.CRITICAL] = "";
                        row[metrics[j] + "_" + ApplicationIncidentForm.MAJOR] = "";
                        row[metrics[j] + "_" + ApplicationIncidentForm.MINOR] = "";
                    }
                    gridata.push(row);
                }

                /*
                 ToDo: ToDo: ToDo: ToDo: todo todo todo todo todo
                 Inserting blank rows in this way simply does not work -
                 one) it is bound to the model - it should not be - this kind of logic should be in AonDgrid class and not here
                 two) sorting does not work with this logic - blank rows gets mixed up in the sort
                 So, find a better way to add blank rows and till then keep this crap code as a reminder
                 */
                /*if(input.applicationVO.applications.length < 35) {
                    for(var z = input.applicationVO.applications.length; z < 35; z++) {
                        var row = {};
                        row.appName = "blank row";
                        row.id = " ";
                        for (var j = 0; j < metrics.length; j++) {
                            row[metrics[j] + "_" + ApplicationIncidentForm.CRITICAL] = " ";
                            row[metrics[j] + "_" + ApplicationIncidentForm.MAJOR] = " ";
                            row[metrics[j] + "_" + ApplicationIncidentForm.MINOR] = " ";
                        }
                        gridata.push(row);
                    }
                }*/

                try {

                    ApplicationIncidentForm.Grid = new Grid();
                    ApplicationIncidentForm.Grid.setColumnMeta(columnMeta);
                    ApplicationIncidentForm.Grid.setData(gridata);
                    ApplicationIncidentForm.Grid.render(this.innerDIV);
                    ApplicationIncidentForm.Grid.handleRowClick(this); // the handleRowClick() callback is invoked in this case

                } catch (e) {
                    console.log("exception = " + e);
                }

                // assign ids to nodes
                for (var j = 0; j < metrics.length; j++) {
                    dojo.query("td.field-" + metrics[j] + "_" + ApplicationIncidentForm.CRITICAL).forEach(function (node) {
                        node.style.color = "red";
                    });

                    dojo.query("td.field-" + metrics[j] + "_" + ApplicationIncidentForm.MAJOR).forEach(function (node) {
                        node.style.color = "orange";
                    });

                    dojo.query("td.field-" + metrics[j] + "_" + ApplicationIncidentForm.MINOR).forEach(function (node) {
                        node.style.color = "blue";
                    });
                }

                ApplicationIncidentForm.POSTSET.metricsJson = dojo.toJson(metrics);
                ApplicationIncidentForm.POSTSET.dataset = [];

                for (var i = 0; i < input.applicationVO.applications.length; i++) {
                    var apps = input.applicationVO.applications;
                    var datum = {};
                    datum.id = apps[i].id;
                    datum.name = apps[i].name;
                    ApplicationIncidentForm.POSTSET.dataset.push(datum);
                }

                // do the first time population immediately
                for (var i = 0; i < ApplicationIncidentForm.POSTSET.dataset.length; i++) {
                    this.periodicAppPost();
                }

                Scheduler.POLLER = this;
                this.startStaggeredDatabasePolling();
            },

            handleRowClick:function (evt) {
                var row = ApplicationIncidentForm.Grid.getRow(evt);

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
            },

            startStaggeredDatabasePolling:function () {
                var period = 1;
                for (var i = 0; i < ApplicationIncidentForm.POSTSET.dataset.length; i++) {
                    // first one launches after one second
                    // 2nd one at 4 sec, 3rd one at 7 sec and so on till --> 1 + (3*20) = 61 seconds
                    var timer = setTimeout(dojo.hitch(this, this.periodicApp), period * 1000);
                    period += ApplicationIncidentForm.APP_STAGGER_PERIOD;
                    Scheduler.TIMERS.push(timer);
                }
            },

            periodicApp:function () {
                var timer = setInterval(dojo.hitch(this, this.periodicAppPost),
                    ApplicationIncidentForm.POSTSET.dataset.length * ApplicationIncidentForm.APP_STAGGER_PERIOD * 1000);
                Scheduler.TIMERS.push(timer);
            },

            periodicAppPost:function () {
                var appDataSet = ApplicationIncidentForm.POSTSET.dataset[ApplicationIncidentForm.APP_COUNTER];
                console.log("querying for app = " + appDataSet.name);

                var viewMeta = {
                    id:appDataSet.id,
                    name:appDataSet.name,
                    custom:[ApplicationIncidentForm.POSTSET.metricsJson]
                };

                xhr(ApplicationIncidentForm.DATACLASS, {
                    handleAs:"json",
                    method:"POST",
                    query:viewMeta,
                    headers:Helper.JSON_HEADER
                }).then(lang.hitch(this, this.createIncidentGridData));

                ApplicationIncidentForm.APP_COUNTER++;
                if (ApplicationIncidentForm.APP_COUNTER > (ApplicationIncidentForm.POSTSET.dataset.length - 1)) {
                    ApplicationIncidentForm.APP_COUNTER = 0;
                }
            },

            createIncidentGridData:function (input) {
                var data = Helper.parseInput(input);
                this.refreshRow(data, input);
            },

            refreshRow:function (data, input) {

                var row = {};
                row.appName = data.name;
                row.id = data.id;

                var customMetrics = dojo.fromJson(data.custom[0]);
                console.log("custom len = " + customMetrics.length);
                for (var i = 0; i < customMetrics.length; i++) {
                    var metric = customMetrics[i];

                    for (var j = 0; j < input.applicationDataVO.metrics.length; j++) {
                        var payload = input.applicationDataVO.metrics[j];
                        if (payload.name != metric) {
                            continue;
                        }

                        row[metric + "_" + ApplicationIncidentForm.CRITICAL] = payload.count[0];
                        row[metric + "_" + ApplicationIncidentForm.MAJOR] = payload.count[1];
                        row[metric + "_" + ApplicationIncidentForm.MINOR] = Math.floor(Math.random() * 100);

                        break;
                    }
                }

                ApplicationIncidentForm.Grid.addRow(row);
                dashboard.dom.STANDBY.hide();
            }

        });

        // static variables of this class
        ApplicationIncidentForm.LOG = Logger.addTimer(new Logger(dashboard.classnames.ApplicationIncidentForm));

        ApplicationIncidentForm.POSTSET = {};
        ApplicationIncidentForm.APP_COUNTER = 0;
        ApplicationIncidentForm.APP_STAGGER_PERIOD = 3;
        ApplicationIncidentForm.CONFIG_PERIOD = 5;
        ApplicationIncidentForm.DATACLASS = null;

        ApplicationIncidentForm.CRITICAL = "critical";
        ApplicationIncidentForm.MAJOR = "major";
        ApplicationIncidentForm.MINOR = "minor";


        return ApplicationIncidentForm;
    });