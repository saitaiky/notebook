"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollToFeedbackButton = void 0;
var styles_module_scss_1 = require("./styles.module.scss");
var react_1 = require("react");
var ScrollToFeedbackButton = function (_a) {
    var path = _a.path;
    var scrollToFeedback = function () {
        var feedbackElement = document.getElementById('feedback');
        var y = feedbackElement.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };
    // Do not show on Intro page
    if (path === '/docs/latest/index/') {
        return null;
    }
    return (<div className={styles_module_scss_1.default.scrollToWrapper} onClick={scrollToFeedback}>
      Feedback 👋
    </div>);
};
exports.ScrollToFeedbackButton = ScrollToFeedbackButton;
