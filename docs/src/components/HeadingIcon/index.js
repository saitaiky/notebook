"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("react");
var theme_common_1 = require("@docusaurus/theme-common");
var cloud_light_svg_1 = require("@site/static/icons/cloud-light.svg");
var cloud_dark_svg_1 = require("@site/static/icons/cloud-dark.svg");
var enterprise_light_svg_1 = require("@site/static/icons/enterprise-light.svg");
var enterprise_dark_svg_1 = require("@site/static/icons/enterprise-dark.svg");
// TODO: Update these with correct file imports
var ce_ee_light_svg_1 = require("@site/static/icons/ce_ee_light.svg");
var ce_ee_dark_svg_1 = require("@site/static/icons/ce_ee_dark.svg");
var styles_module_scss_1 = require("./styles.module.scss");
var HeadingIcon = function (_a) {
    var icon = _a.icon, size = _a.size;
    var _b = (0, theme_common_1.useColorMode)(), colorMode = _b.colorMode, setColorMode = _b.setColorMode;
    var _c = (0, react_2.useState)(''), iconTheme = _c[0], setIconTheme = _c[1];
    (0, react_2.useEffect)(function () {
        setIconTheme(colorMode === 'dark' ? 'dark' : 'light');
    }, [colorMode]);
    return (<div className={"".concat(styles_module_scss_1.default['icon-container'])}>
      {icon === "cloud" && iconTheme === "dark" && <cloud_light_svg_1.default style={{ width: size, height: size }}/>}
      {icon === "cloud" && iconTheme === "light" && <cloud_dark_svg_1.default style={{ width: size, height: size }}/>}
      {icon === "ee" && iconTheme === "dark" && <enterprise_light_svg_1.default style={{ width: size, height: size }}/>}
      {icon === "ee" && iconTheme === "light" && <enterprise_dark_svg_1.default style={{ width: size, height: size }}/>}
      {icon === "cloud-ee" && iconTheme === "light" && <ce_ee_dark_svg_1.default style={{ width: size, height: size }}/>}
      {icon === "cloud-ee" && iconTheme === "dark" && <ce_ee_light_svg_1.default style={{ width: size, height: size }}/>}
    </div>);
};
exports.default = HeadingIcon;
