define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/views/application/nls/application", "dojo/request/xhr", "dojo/keys", "dojo/on", "dijit/Dialog",
    "dashboard/logger/Logger", "dashboard/helper/Helper"],

    function (declare, i18n, i18nString, xhr, keys, on, Dialog, Logger, Helper) {

        dashboard.classnames.ApplicationUtility = "dashboard.application.ApplicationUtility";

        var ApplicationUtility = declare(dashboard.classnames.ApplicationUtility, null, {});

        ApplicationUtility.InitKeyControls = function () {
            on(document.body, "keypress", function (evt) {
                var charOrCode = evt.charCode || evt.keyCode;
                switch (charOrCode) {
                    case keys.ESCAPE:
                        // stop all timers and stop scrolling on first keypress
                        // on second keypress restart all
                        require(["dashboard/views/application/PageLoader"], function (PageLoader) {
                            if (ApplicationUtility.ESCAPE_HIT == false) {
                                ApplicationUtility.ESCAPE_HIT = true;
                                clearInterval(PageLoader.SCROLL_TIMER);
                                var title = "Escape Hit";
                                var content = "Stopped scrolling and refresh of all data";
                                if(ApplicationUtility.ESCAPE_DIALOG == null) {
                                    ApplicationUtility.ESCAPE_DIALOG = new Dialog({
                                        title: title,
                                        content: content
                                    });
                                    ApplicationUtility.ESCAPE_DIALOG.show();
                                } else {
                                    ApplicationUtility.ESCAPE_DIALOG.attr("content", content);
                                    ApplicationUtility.ESCAPE_DIALOG.attr("title", title);
                                    ApplicationUtility.ESCAPE_DIALOG.show();
                                }
                            } else {
                                ApplicationUtility.ESCAPE_HIT = false;
                                PageLoader.SCROLL_TIMER = setInterval(PageLoader.prototype.pageScroll, PageLoader.SCROLL_PERIOD);
                                if(ApplicationUtility.ESCAPE_DIALOG != null) {
                                    ApplicationUtility.ESCAPE_DIALOG.attr("content", "Restarted scrolling and refresh of data");
                                    ApplicationUtility.ESCAPE_DIALOG.attr("title", "Escape Hit Cleared");
                                    ApplicationUtility.ESCAPE_DIALOG.show();
                                } else {
                                    console.log("somehow escape dialog not initialized");
                                }
                            }
                            setTimeout(function(){dashboard.application.ApplicationUtility.ESCAPE_DIALOG.hide();}, 2*1000);
                        });
                        break;
                    case keys.SPACE:
                        // stop scrolling but NOT timers on first keypress
                        // restart scroll on second keypress

                        require(["dashboard/views/application/PageLoader"], function (PageLoader) {
                            if (ApplicationUtility.SPACE_HIT == false) {
                                ApplicationUtility.SPACE_HIT = true;
                                clearInterval(PageLoader.SCROLL_TIMER);
                                var title = "Space Hit";
                                var content = "Stopped scrolling but data refresh continues...";
                                if(ApplicationUtility.SPACE_DIALOG == null) {
                                    ApplicationUtility.SPACE_DIALOG = new Dialog({
                                        title: title,
                                        content: content
                                    });
                                    ApplicationUtility.SPACE_DIALOG.show();
                                } else {
                                    ApplicationUtility.SPACE_DIALOG.attr("content", content);
                                    ApplicationUtility.ESCAPE_DIALOG.attr("title", title);
                                    ApplicationUtility.SPACE_DIALOG.show();
                                }
                            } else {
                                ApplicationUtility.SPACE_HIT = false;
                                PageLoader.SCROLL_TIMER = setInterval(PageLoader.prototype.pageScroll, PageLoader.SCROLL_PERIOD);
                                if(ApplicationUtility.SPACE_DIALOG != null) {
                                    ApplicationUtility.SPACE_DIALOG.attr("content", "Restarted scrolling and refresh of data");
                                    ApplicationUtility.SPACE_DIALOG.attr("title", "Space Hit Cleared");
                                    ApplicationUtility.SPACE_DIALOG.show();
                                } else {
                                    console.log("Somehow space hit but dialog not initialized");
                                }
                            }
                            setTimeout(function(){dashboard.application.ApplicationUtility.SPACE_DIALOG.hide();}, 2*1000);
                        });
                        break;
                }
            })
        };

        ApplicationUtility.LOG = new Logger(dashboard.classnames.ApplicationUtility);

        ApplicationUtility.SPACE_HIT = false;
        ApplicationUtility.ESCAPE_HIT = false;

        ApplicationUtility.ESCAPE_DIALOG = null;
        ApplicationUtility.SPACE_DIALOG = null;

        return ApplicationUtility;
    });