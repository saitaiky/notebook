"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DocItem_1 = require("@theme/DocItem");
var styles_module_scss_1 = require("./styles.module.scss");
var Head_1 = require("@docusaurus/Head");
var CustomDocItemWiki = function (props) { return (<div className={"custom_doc_item_wrapper ".concat(styles_module_scss_1.default["custom_doc_item_wrapper"])}>
    <Head_1.default>
      <meta name="robots" content="noindex"/>
    </Head_1.default>
    <DocItem_1.default {...props}/>
  </div>); };
exports.default = CustomDocItemWiki;
