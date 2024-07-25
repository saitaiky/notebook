"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useIsBrowser_1 = require("@docusaurus/useIsBrowser");
var BrowserOnly_1 = require("@docusaurus/BrowserOnly");
var styles_module_scss_1 = require("./styles.module.scss");
function Paperform(_a) {
    var _this = this;
    var formId = _a.formId, _b = _a.styleClassName, styleClassName = _b === void 0 ? "" : _b;
    var isBrowser = (0, useIsBrowser_1.default)();
    var _c = (0, react_1.useState)(false), isLoaded = _c[0], setIsLoaded = _c[1];
    var embedDivRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var existingEmbed = document.getElementById("paperform_embed");
        if (existingEmbed) {
            setIsLoaded(true);
            return;
        }
        var script = document.createElement("script");
        script.id = "paperform_embed";
        script.src = "https://forms.hasura.io/__embed.min.js";
        script.onreadystatechange = function () {
            if (_this.readyState === "complete" || _this.readyState === "loaded") {
                setIsLoaded(true);
            }
        };
        script.onload = function () { return setIsLoaded(true); };
        document.body.prepend(script);
        return function () { return script.remove(); };
    }, []);
    // function handleFormSubmit({ detail }) {
    //   const { form_id, data } = detail;
    //   const email = data.find(d => d.type === "email")?.value;
    //   if (!!email) {
    //     // let nameTraits = {};
    //     // if (!!vals.FirstName) nameTraits.firstName = vals.FirstName;
    //     // if (!!vals.LastName) nameTraits.lastName = vals.LastName;
    //     window.analytics.identify(email, {
    //       email,
    //       identifiedBy: `Paperform ${form_id} Submitted`,
    //       // ...nameTraits,
    //     });
    //   }
    //   window.analytics.track("form submit", {
    //     data,
    //     category: "website",
    //     label: `Paperform ${form_id} Submitted`,
    //     action: "form submit",
    //   });
    //   typeof onSubmitCB === "function" && onSubmitCB(detail);
    // }
    (0, react_1.useEffect)(function () {
        var refCurrValue = embedDivRef.current;
        // isBrowser &&
        //   refCurrValue?.setAttribute(
        //     "data-prefill",
        //     `utm_landing-page=${window.location.pathname}&utm_search=${window.location.search}`
        //   );
        // refCurrValue?.addEventListener("PaperformSubmission", handleFormSubmit);
        // return () => refCurrValue?.removeEventListener("PaperformSubmission", handleFormSubmit);
    }, [isBrowser]);
    return (<div className={"".concat(styles_module_scss_1.default["paperform-embed-wrapper"], " ").concat(styleClassName ? styleClassName : '')}>
      {!isLoaded && <span className={styles_module_scss_1.default.loadingText}>Loading...</span>}
      <BrowserOnly_1.default>
        {function () { return (<div data-prefill-inherit="1" data-prefill={"utm_landing-page=".concat(window.location.pathname)} data-no-scroll="1" ref={embedDivRef} id={formId} data-paperform-id={formId} data-spinner="1"/>); }}
      </BrowserOnly_1.default>
    </div>);
}
exports.default = Paperform;
