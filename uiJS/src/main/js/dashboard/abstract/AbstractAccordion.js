define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/nls/dashboard", "dojo/on", "dojo/_base/lang", "dojo/dom",
    "dojo/store/Memory", "dashboard/widgets/AccordionTreeObjectStoreModel", "dashboard/widgets/AccordionTree",
    "dashboard/logger/Logger", "dashboard/helper/Scheduler"],

    function (declare, i18n, i18nString, on, lang, dom, Memory, ObjectStoreModel, Tree, Logger, Scheduler) {

        dashboard.classnames.AbstractAccordion = "dashboard.abstract.AbstractAccordion";

        var AbstractAccordion = declare(dashboard.classnames.AbstractAccordion, null, {

            "-chains-":{
                renderAccordion:"before" //method is called before calling its superclass method
            },

            getTreeData:function (data, rootId) {
                var rootNode = {};
                rootNode.id = rootId;

                // ToDo: Make this a recursive function so that multi-level trees are possible on the client side too
                var treeObject = [];
                treeObject.push(rootNode);
                treeObject = treeObject.concat(this.getTreeLeafForParent(data, rootId));

                for(var i=0;i<data.length; i++) {
                    if(data[i].linkList != null) {
                        treeObject = treeObject.concat(this.getTreeLeafForParent(data[i].linkList, data[i].uuid));
                    }
                }
                return treeObject;
            },

            getTreeLeafForParent: function(linksList, parentId) {
                var leafList = [];
                for(var i=0;i<linksList.length; i++) {
                    var leaf = {};
                    leaf.id = linksList[i].uuid; // its not a good idea to set any of the dom id's as EnumId
                    leaf.enumId = linksList[i].enumId;
                    leaf.enumName = linksList[i].name;
                    leaf.name = i18nString[linksList[i].name];
                    leaf.type = linksList[i].type;
                    leaf.parent = parentId;
                    leafList.push(leaf);
                }
                return leafList;
            },

            renderAccordion:function (data) {
                var param = data.param;
                var data = data.linkEntityList;

                if (data == null || data == undefined || param == null || param == undefined) {
                    console.log("blank accordion");
                    return;
                }

                //console.log("in abstract render accordion. data = " + dojo.toJson(data));
                //console.log("in abstract render accordion. param = " + dojo.toJson(param));

                var rootId = param.name[0] + "_treeRoot";
                var myStore = new Memory({
                    data:this.getTreeData(data, rootId),
                    getChildren:function (object) {
                        return this.query({parent:object.id});
                    }
                });

                // Create the model
                var myModel = new ObjectStoreModel({store:myStore, query:{id:rootId}});

                // Create the Tree.
                var tree = new Tree({model:myModel, showRoot: false, openOnClick: true});
                tree.placeAt(dom.byId(param.name[0]));
                tree.startup();

                on(tree, "click", lang.hitch(this, this.renderView));

                // Launch the NOC Screens Application Incident Grid as the default first view
                if(param.name[0] == "NOC") {
                    //tree.set('paths', [rootId, data[0].uuid]); // tried to click the tree node, but it did not work :-(
                    var localItem = {};
                    localItem.enumId = data[0].enumId;
                    localItem.enumName = data[0].name;
                    localItem.id = data[0].uuid;
                    localItem.name = data[0].name;
                    localItem.type = data[0].type;
                    this.renderView(localItem, null, null);
                }

            },

            renderView:function (item, node, evt){
                //Important Note: The below print statements are a Good Reference. Do NOT delete them.

                console.log("Item", item); // This gives you the object in your store
                //console.log("Node", node); // This gives you the dijit widget object (UI)
                //console.log("Event", evt); // This gives you the event object
                //console.log('identifier: ' + tree_obj.getLabel(item));

                this.createView(item.enumId, item.id, item.enumName, item.type, false);
            },

            createView:function (id, uuid, name, type, newWindow) {
                // show the loading spinner
                dashboard.dom.STANDBY.show();

                // cancel all timers on previous page
                Scheduler.cancelAllTimers();

                // destroy everything in the inner most central pane
                dashboard.dom.CpCenterInner[dashboard.pageTypes.dashboard].destroyDescendants(false);

                //destroy the view specific toolbar
                dashboard.dom.Toolbar[dashboard.pageTypes.dashboard].destroyDescendants(false);

                // now, show the page - NOTE: this is a upwards call to inherting class
                this.showView(id, uuid, name, type, newWindow);
            }
        });

        AbstractAccordion.LOG = Logger.addTimer(new Logger(dashboard.classnames.AbstractAccordion));

        return AbstractAccordion;
    });