"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExecutionEnvironment_1 = require("@docusaurus/ExecutionEnvironment");
var globalData_1 = require("@generated/globalData");
exports.default = (function segmentAnalyticsModule() {
    if (!ExecutionEnvironment_1.default.canUseDOM)
        return null;
    var _a = globalData_1.default['docusaurus-plugin-segment-analytics']
        .default, trackPage = _a.trackPage, trackPageDelay = _a.trackPageDelay;
    return {
        onRouteUpdate: function (_a) {
            var location = _a.location;
            // Always refer to the variable on window in case it gets overridden elsewhere.
            if (!trackPage)
                return;
            // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
            // ensure that the segment route tracking is in sync with the actual Gatsby route
            // (otherwise you can end up in a state where the Segment page tracking reports
            // the previous page on route change).
            var delay = Math.max(0, trackPageDelay);
            window.setTimeout(function () {
                window.analytics && window.analytics.page(document.title);
            }, delay);
        },
    };
})();
