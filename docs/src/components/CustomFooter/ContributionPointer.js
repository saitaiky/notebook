"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Link_1 = require("@docusaurus/Link");
var styles_module_scss_1 = require("./styles.module.scss");
var ContributionPointer = function (_a) {
    var element = _a.element;
    var _b = (0, react_1.useState)(false), isHover = _b[0], setIsHover = _b[1];
    (0, react_1.useEffect)(function () {
        if (!element)
            return;
        element.addEventListener('mouseenter', function () {
            setIsHover(true);
        });
        element.addEventListener('mouseleave', function () {
            setIsHover(false);
        });
    }, [element]);
    return (<Link_1.default className={"".concat(styles_module_scss_1.default['contribution-pointer'], " ").concat(isHover ? styles_module_scss_1.default['contribution-hover'] : '')} href="https://hasura.io/docs/wiki/contributions/" rel="noopener noreferrer">
      <div className={styles_module_scss_1.default['contribution-pointer__text']}>
        <span>Have questions? Check out our contribution guide!</span>
      </div>
    </Link_1.default>);
};
exports.default = ContributionPointer;
