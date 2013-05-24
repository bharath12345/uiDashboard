define(["dojo/_base/declare", "dojo/i18n", "dojox/form/CheckedMultiSelect", "dijit/form/Button", "dojo/_base/lang",
    "dojo/dom", "dojo/dom-style", "dojo/dom-construct",
    "dashboard/logger/Logger", "dashboard/views/config/ConfigUtility", "dojo/i18n!dashboard/views/config/nls/config"],

    function (declare, i18n, DojoCheckedMultiSelect, Button, lang, dom, domStyle, domConstruct, Logger, ConfigUtility, i18nString) {

        dashboard.classnames.ConfigWidgetCheckedMultiSelect = "dashboard.config.widgets.ConfigWidgetCheckedMultiSelect";

        var ConfigWidgetCheckedMultiSelect = declare(dashboard.classnames.ConfigWidgetCheckedMultiSelect, null, {

            render:function (node, type, selectedValue, restValues) {
                this.createSkeleton(node, type);

                this.lhsCMS = this.makeCMS(restValues, "lhsSelect" + type);
                this.rhsCMS = this.makeCMS(selectedValue, "rhsSelect" + type);

            },

            makeCMS:function (values, id) {
                var options = [];
                if (values == null || values == undefined) {
                    values = [];
                }
                for (var i = 0; i < values.length; i++) {
                    console.log("cms id = " + id + " value = " + values[i]);
                    options[i] = {label:values[i], value:values[i], selected:false};
                }
                var CMS = new DojoCheckedMultiSelect({
                    multiple:true,
                    name:"multiselect"
                }, id);
                CMS.addOption(options);
                return CMS;
            },

            createSkeleton:function (node, type) {
                var table = domConstruct.create("table");
                node.appendChild(table);

                var row = domConstruct.create("tr");
                table.appendChild(row);
                var col = domConstruct.create("td");
                row.appendChild(col);

                var select = domConstruct.create("select");
                select.id = "lhsSelect" + type;
                col.appendChild(select);

                col = domConstruct.create("td");
                this.makeButtons(col, type);
                row.appendChild(col);

                col = domConstruct.create("td");
                select = domConstruct.create("select");
                select.id = "rhsSelect" + type;
                col.appendChild(select);
                row.appendChild(col);
            },

            getNewRowCol:function (table) {
                var row = domConstruct.create("tr");
                table.appendChild(row);
                var col = domConstruct.create("td");
                row.appendChild(col);
                return col;
            },

            setButtonStyle:function (btn) {
                domStyle.set(btn.domNode, "width", "150px");
                domStyle.set(btn.domNode, "fontSize", "11");
                domStyle.set(btn.domNode.firstChild, "display", "block");
            },

            makeButtons:function (bigCol, type) {
                var table = domConstruct.create("table");
                bigCol.appendChild(table);

                var col = this.getNewRowCol(table);
                var tempAdd = domConstruct.create("div");
                col.appendChild(tempAdd);
                var tempRemove = domConstruct.create("div");
                col.appendChild(tempRemove);

                col = this.getNewRowCol(table);
                var tempSelectAllLeft = domConstruct.create("div");
                col.appendChild(tempSelectAllLeft);
                var tempUnselectAllLeft = domConstruct.create("div");
                col.appendChild(tempUnselectAllLeft);

                col = this.getNewRowCol(table);
                var tempSelectAllRight = domConstruct.create("div");
                col.appendChild(tempSelectAllRight);
                var tempUnselectAllRight = domConstruct.create("div");
                col.appendChild(tempUnselectAllRight);

                var addButtonObj = new Button({label:"Add", id:type + "_Add" + ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX}, tempAdd);
                var removeButtonObj = new Button({label:"Remove", id:type + "_Remove" + ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX}, tempRemove);

                var selectAllLeftButtonObj = new Button({label:"Select All on Left", id:type + "_SelectAllLeft" + ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX}, tempSelectAllLeft);
                var unselectAllLeftButtonObj = new Button({label:"Unselect All on Left", id:type + "_UnselectAllLeft" + ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX}, tempUnselectAllLeft);

                var selectAllRightButtonObj = new Button({label:"Select All on Right", id:type + "_SelectAllRight" + ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX}, tempSelectAllRight);
                var unselectAllRightButtonObj = new Button({label:"Unselect All on Right", id:type + "_UnselectAllRight" + ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX}, tempUnselectAllRight);

                this.setButtonStyle(addButtonObj);
                this.setButtonStyle(removeButtonObj);
                this.setButtonStyle(selectAllLeftButtonObj);
                this.setButtonStyle(unselectAllLeftButtonObj);
                this.setButtonStyle(selectAllRightButtonObj);
                this.setButtonStyle(unselectAllRightButtonObj);

                dojo.connect(addButtonObj, "onClick", lang.hitch(this, this.moveLhsToRhs));
                dojo.connect(removeButtonObj, "onClick", lang.hitch(this, this.moveRhsToLhs));

                dojo.connect(selectAllLeftButtonObj, "onClick", lang.hitch(this, this.selectAllLeft));
                dojo.connect(unselectAllLeftButtonObj, "onClick", lang.hitch(this, this.unselectAllLeft));

                dojo.connect(selectAllRightButtonObj, "onClick", lang.hitch(this, this.selectAllRight));
                dojo.connect(unselectAllRightButtonObj, "onClick", lang.hitch(this, this.unselectAllRight));
            },

            getAttribute:function (id) {
                var attribute = id.split("_")[0];
                return attribute;
            },

            selectAllLeft:function (event) {
                this.selectAllCMS(this.lhsCMS);
            },
            unselectAllLeft:function (event) {
                this.unselectAllCMS(this.lhsCMS);
            },
            selectAllRight:function (event) {
                this.selectAllCMS(this.rhsCMS);
            },
            unselectAllRight:function (event) {
                this.unselectAllCMS(this.rhsCMS);
            },

            moveLhsToRhs:function () {
                dashboard.dom.STANDBY.show();
                var msLhsOptions = this.lhsCMS.getOptions();
                var msRhsOptions = this.rhsCMS.getOptions();
                for (var i = 0; i < msLhsOptions.length; i++) {
                    if (msLhsOptions[i].selected == true) {
                        console.log("selected option = " + msLhsOptions[i].value + " label = " + msLhsOptions[i].label);
                        var found = false;
                        for (var j = 0; j < msRhsOptions.length; j++) {
                            if (msLhsOptions[i].value == msRhsOptions[j].value) {
                                found = true;
                                break;
                            }
                        }
                        if (found == true) {
                            continue;
                        }
                        var newRhsOption = {label:msLhsOptions[i].value, value:msLhsOptions[i].value, selected:false};
                        this.rhsCMS.addOption(newRhsOption);
                    }
                }
                dashboard.dom.STANDBY.hide();
            },

            moveRhsToLhs:function () {
                dashboard.dom.STANDBY.show();
                var msRhsOptions = this.rhsCMS.getOptions();
                for (var i = 0; i < msRhsOptions.length; i++) {
                    if (msRhsOptions[i].selected == true) {
                        console.log("selected option = " + msRhsOptions[i].value + " label = " + msRhsOptions[i].label);
                        this.rhsCMS.removeOption(msRhsOptions[i]);
                    }
                }
                dashboard.dom.STANDBY.hide();
            },

            selectAllCMS:function (cms) {
                this.cmsUpdate(true, cms);
            },

            unselectAllCMS:function (cms) {
                this.cmsUpdate(false, cms);
            },

            cmsUpdate:function (bool, cms) {
                dashboard.dom.STANDBY.show();
                var cmsOptions = cms.getOptions();
                for (var i = 0; i < cmsOptions.length; i++) {
                    cmsOptions[i].selected = bool;
                }
                cms.updateOption(cmsOptions);
                dashboard.dom.STANDBY.hide();
            }

        });

        ConfigWidgetCheckedMultiSelect.LOG = Logger.addTimer(new Logger(dashboard.classnames.ConfigWidgetCheckedMultiSelect));
        ConfigWidgetCheckedMultiSelect.POSTFIX = "_CheckedMultiSelect";
        ConfigWidgetCheckedMultiSelect.BUTTONPOSTFIX = ConfigWidgetCheckedMultiSelect.POSTFIX + "Button";

        return ConfigWidgetCheckedMultiSelect;
    });