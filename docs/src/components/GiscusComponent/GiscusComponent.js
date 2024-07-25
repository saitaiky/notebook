"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiscusComponent = void 0;
var react_1 = require("react");
var react_2 = require("@giscus/react");
var theme_common_1 = require("@docusaurus/theme-common");
var GiscusComponent = function () {
    var colorMode = (0, theme_common_1.useColorMode)().colorMode;
    return (<react_2.default repo="saitaiky/notebook" repoId="R_kgDOKhKTsA" category="Announcements" categoryId="DIC_kwDOKhKTsM4CarA6" // E.g. id of "Announcements"
     mapping="pathname" // Important! To map comments to URL
     term="Welcome to @giscus/react component!" strict="0" reactionsEnabled="1" emitMetadata="0" inputPosition="top" theme={colorMode} lang="en" loading="lazy"/>);
};
exports.GiscusComponent = GiscusComponent;
