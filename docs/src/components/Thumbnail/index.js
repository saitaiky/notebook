"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var BrowserOnly_1 = require("@docusaurus/BrowserOnly");
var react_transition_group_1 = require("react-transition-group");
var styles_module_scss_1 = require("./styles.module.scss");
// Modal Implementation Ref: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a
var Modal = function (props) {
    var closeOnEscapeKeyDown = function (e) {
        if (e.key === "Escape") {
            props.onClose();
        }
    };
    (0, react_1.useEffect)(function () {
        document.body.addEventListener("keydown", closeOnEscapeKeyDown);
        return function () {
            document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
        };
    }, []);
    return react_dom_1.default.createPortal(<react_transition_group_1.CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }} classNames={{
            enterDone: styles_module_scss_1.default['enter-done'],
            exit: styles_module_scss_1.default['exit']
        }}>
      <div className={styles_module_scss_1.default["modal"]} onClick={props.onClose}>
        <div className={styles_module_scss_1.default["modal-content"]} onClick={function (e) { return e.stopPropagation(); }}>
          <div className={styles_module_scss_1.default["modal-body"]}>{props.children}</div>
          <div className={styles_module_scss_1.default["modal-footer"]}>
            <button onClick={props.onClose} className={styles_module_scss_1.default["button"]}>
              x
            </button>
          </div>
        </div>
      </div>
    </react_transition_group_1.CSSTransition>, document.getElementsByTagName("body")[0]);
};
var Thumbnail = function (_a) {
    var src = _a.src, restProps = __rest(_a, ["src"]);
    var _b = (0, react_1.useState)(false), openModal = _b[0], setOpenModal = _b[1];
    var resolvedImage = require("@site/static".concat(src)).default;
    return (<div className={styles_module_scss_1.default["thumbnail"]}>
      <img src={resolvedImage} {...restProps} className={"".concat(styles_module_scss_1.default["main-img"], " ").concat(restProps.className || "")} onClick={function () { return setOpenModal(true); }}/>
      <BrowserOnly_1.default>
        {function () { return (<Modal onClose={function () { return setOpenModal(false); }} show={openModal}>
            <img src={resolvedImage} {...restProps} className={"".concat(styles_module_scss_1.default["modal-img"], " ").concat(restProps.className || "")}/>
          </Modal>); }}
      </BrowserOnly_1.default>
    </div>);
};
exports.default = Thumbnail;
