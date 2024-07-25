"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saTrack = void 0;
var saTrack = function (eventName, properties) {
    // if window.analytics is not available - it's an issue with plugin `src/plugins/docusaurus-plugin-segment-analytics`
    window.analytics &&
        window.analytics.track(eventName, __assign(__assign({}, properties), { category: "docs" }));
};
exports.saTrack = saTrack;
