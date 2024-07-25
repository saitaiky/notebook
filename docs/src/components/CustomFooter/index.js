"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var Link_1 = require("@docusaurus/Link");
var ContributionPointer_1 = require("./ContributionPointer");
var github_svg_1 = require("@site/static/icons/github.svg");
var linkedin_svg_1 = require("@site/static/icons/linkedin.svg");
var styles_module_scss_1 = require("./styles.module.scss");
var uuid_1 = require("uuid");
var CustomFooter = function () {
    var _a = (0, react_1.useState)(null), element = _a[0], setElement = _a[1];
    (0, react_1.useEffect)(function () {
        if (!localStorage.getItem('hasuraDocsUserID')) {
            var userID = (0, uuid_1.v4)();
            localStorage.setItem('hasuraDocsUserID', userID);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        var editMetaRow = document.querySelector('.theme-doc-footer-edit-meta-row > .col');
        setElement(editMetaRow);
        editMetaRow.style.position = 'relative';
        var div = document.createElement('div');
        editMetaRow.appendChild(div);
        react_dom_1.default.render(<ContributionPointer_1.default element={element}/>, div);
    }, [element]);
    return (<footer className={styles_module_scss_1.default["custom-footer-wrapper"]}>
      <div className={styles_module_scss_1.default["logo-wrapper"]}>
      {/*
          <img src={useBaseUrl("/img/logo-light.svg")} className={styles["dark-theme-logo"]} />
          <img src={useBaseUrl("/img/logo.svg")} className={styles["light-theme-logo"]} />
        */}
      </div>
      <div className={styles_module_scss_1.default["copyright"]}>
        {"\u00A9 ".concat(new Date().getFullYear(), " Sai Tai. All rights reserved")}
      </div>
      <div className={styles_module_scss_1.default["footerSocialIconsWrapper"]}>
        <div className={styles_module_scss_1.default["socialBrands"]}>
          <Link_1.default href={"https://github.com/saitaiky/"} rel="noopener noreferrer" aria-label={"Github"}>
            <github_svg_1.default />
          </Link_1.default>
        </div>
        <div className={styles_module_scss_1.default["socialBrands"]}>
          <Link_1.default href={"https://www.linkedin.com/in/saitai/"} rel="noopener noreferrer" aria-label={"Linkedin"}>
            <linkedin_svg_1.default />
          </Link_1.default>
        </div>
      </div>
    </footer>);
};
exports.default = CustomFooter;
