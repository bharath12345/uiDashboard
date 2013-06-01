define(["dojo/_base/declare", "dojo/i18n", "dojo/i18n!dashboard/nls/dashboard",
    "dojo/request/xhr", "dojo/_base/lang", "dashboard/logger/Logger", "dashboard/helper/Helper"],

    function (declare, i18n, i18nString, xhr, lang, Logger, Helper) {

        dashboard.classnames.JBossProtoAlertsRealtime = "dashboard.JBossProtoAlertsRealtime";

        var JBossProtoAlertsRealtime = declare(dashboard.classnames.JBossProtoAlertsRealtime, null, {

            startWebsocket: function() {

                var host = 'ws://localhost:9090/AlertsJson';
                var socket = new WebSocket(host);
                socket.onopen = function () {
                    console.log('socket onopen readyState = ' + socket.readyState);
                }

                socket.onmessage = function (msg) {
                    console.log('websocket message' + msg);
                    console.log('websocket data = ' + msg.data);
                }

                socket.onclose = function () {
                    console.log('socket onclose readyState = ' + socket.readyState);
                }

            }
        
        });

        JBossProtoAlertsRealtime.LOG = Logger.addTimer(new Logger(dashboard.classnames.JBossProtoAlertsRealtime));

        return JBossProtoAlertsRealtime;
    });