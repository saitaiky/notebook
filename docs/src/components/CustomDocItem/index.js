"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DocItem_1 = require("@theme/DocItem");
var CustomFooter_1 = require("@site/src/components/CustomFooter");
var styles_module_scss_1 = require("./styles.module.scss");
var router_1 = require("@docusaurus/router");
var CustomDocItem = function (props) {
    (0, react_1.useEffect)(function () {
        // This function is adds <wbr> tags to code blocks within a table
        // wherever an _ or . is present. We do this since so many environment
        // variables are incredibly long and the word breaks are not happening
        // in a user-friendly way.
        var tables = document.querySelectorAll('table');
        // code blocks inside of tables
        tables.forEach(function (table) {
            var cells = table.querySelectorAll('td');
            cells.forEach(function (cell) {
                var codeBlocks = cell.querySelectorAll('code');
                codeBlocks.forEach(function (codeBlock) {
                    codeBlock.innerHTML = codeBlock.innerHTML.replace(/_/g, '_<wbr>');
                    codeBlock.innerHTML = codeBlock.innerHTML.replace(/\./g, '.<wbr>');
                    console.log(codeBlock.innerHTML);
                });
            });
        });
        // not code blocks, like the metadata-api request type page
        var metadataApiTable = document.querySelector('.api-metadata-request-type-table');
        if (metadataApiTable) {
            var cells = metadataApiTable.querySelectorAll('td');
            cells.forEach(function (cell) {
                cell.innerHTML = cell.innerHTML.replace(/_/g, '_<wbr>');
            });
        }
    }, []);
    // redirect them to the index if they attempt to directly navigate to a path with
    // _heading_ in it
    if (props.location.pathname.includes('_heading_')) {
        return <router_1.Redirect to="/docs/latest/index/"/>;
    }
    return (<div className={props.location.pathname === "/docs/latest/index/"
            ? "custom_doc_item_wrapper custom_doc_item_wrapper-x-wide"
            : "custom_doc_item_wrapper ".concat(styles_module_scss_1.default['custom_doc_item_wrapper'])}>
      <DocItem_1.default {...props}/>
      <div className={props.location.pathname === "/docs/latest/index/" || props.location.pathname.includes('overview')
            ? "custom_doc_item_footer-x-wide"
            : styles_module_scss_1.default['custom_doc_item_footer']}>
        {/*<PageHelpful />*/}
        {/* <HasuraConBanner {...props} /> */}
        {/* <GraphQLWithHasuraBanner /> */}
        <CustomFooter_1.default />
      </div>
    </div>);
};
exports.default = CustomDocItem;
