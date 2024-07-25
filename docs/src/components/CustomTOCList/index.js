"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTOCListContent = exports.CustomTOCListHead = exports.CustomTOCListSection = exports.CustomTOCList = void 0;
var react_1 = require("react");
var styles_module_scss_1 = require("./styles.module.scss");
var CustomTOCList = function (_a) {
    var children = _a.children;
    return (<div className={styles_module_scss_1.default["toc-list"]}>
    {children}
  </div>);
};
exports.CustomTOCList = CustomTOCList;
var CustomTOCListSection = function (_a) {
    var children = _a.children;
    return (<div className={styles_module_scss_1.default["toc-list-section"]}>
    {children}
  </div>);
};
exports.CustomTOCListSection = CustomTOCListSection;
var CustomTOCListHead = function (_a) {
    var children = _a.children;
    return (<div className={styles_module_scss_1.default["toc-list-head"]}>
    {children}
  </div>);
};
exports.CustomTOCListHead = CustomTOCListHead;
var CustomTOCListContent = function (_a) {
    var children = _a.children;
    return (<ul className={styles_module_scss_1.default["toc-list-content"]}>
    {children.map(function (child, index) { return <li key={"toc-lc-".concat(index)}>{child}</li>; })}
  </ul>);
};
exports.CustomTOCListContent = CustomTOCListContent;
