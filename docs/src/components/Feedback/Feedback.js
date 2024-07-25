"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
var react_1 = require("react");
var segmentAnalytics_1 = require("@site/src/utils/segmentAnalytics");
var styles_module_scss_1 = require("./styles.module.scss");
var Feedback = function (_a) {
    var metadata = _a.metadata;
    var _b = (0, react_1.useState)(null), rating = _b[0], setRating = _b[1];
    var _c = (0, react_1.useState)(null), notes = _c[0], setNotes = _c[1];
    var _d = (0, react_1.useState)(null), errorText = _d[0], setErrorText = _d[1];
    var _e = (0, react_1.useState)(null), hoveredScore = _e[0], setHoveredScore = _e[1];
    var _f = (0, react_1.useState)(null), textAreaLabel = _f[0], setTextAreaLabel = _f[1];
    var _g = (0, react_1.useState)('This section is optional ✌️'), textAreaPlaceholder = _g[0], setTextAreaPlaceholder = _g[1];
    var _h = (0, react_1.useState)(false), isSubmitSuccess = _h[0], setIsSubmitSuccess = _h[1];
    var submitDisabled = rating === null || (rating < 4 && (notes === null || notes === ''));
    var scores = [1, 2, 3, 4, 5];
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendData;
        return __generator(this, function (_a) {
            if (rating === null) {
                setErrorText('Please select a score.');
                return [2 /*return*/];
            }
            if (rating < 4 && notes === null) {
                setErrorText("Because this doc wasn't up to scratch please provide us with some feedback of where we can improve.");
                return [2 /*return*/];
            }
            sendData = function () { return __awaiter(void 0, void 0, void 0, function () {
                var myHeaders, raw, requestOptions;
                return __generator(this, function (_a) {
                    myHeaders = new Headers();
                    myHeaders.append('Content-Type', 'application/json');
                    raw = JSON.stringify({
                        feedback: {
                            isHelpful: rating >= 4 ? "\uD83D\uDC4D" : "\uD83D\uDC4E",
                            score: rating,
                            notes: notes,
                            pageTitle: document.title,
                            url: window.location.href,
                        },
                    });
                    requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow',
                    };
                    fetch('https://us-central1-websitecloud-352908.cloudfunctions.net/docs-feedback', requestOptions)
                        .then(function (response) { return response.text(); })
                        .catch(function (error) { return console.error('error', error); });
                    return [2 /*return*/];
                });
            }); };
            // Sai: This part prevent any other website send the data to the backend.
            if (!window.location.hostname.includes('hasura.io')) {
                alert('Hey! Thank you for letting me know your feedback🎉\n\n Appreciate that.✌️');
                setRating(null);
                setNotes(null);
                setIsSubmitSuccess(true);
                return [2 /*return*/];
            }
            sendData()
                .then(function () {
                (0, segmentAnalytics_1.saTrack)('Responded to Did You Find This Page Helpful', {
                    label: 'Responded to Did You Find This Page Helpful',
                    response: rating >= 4 ? 'YES' : 'NO',
                    pageUrl: window.location.href,
                });
                setRating(null);
                setNotes(null);
                setIsSubmitSuccess(true);
            })
                .catch(function (e) {
                console.error(e);
            });
            return [2 /*return*/];
        });
    }); };
    var handleScoreClick = function (scoreItem) {
        if (scoreItem === rating) {
            setRating(null);
            setErrorText(null);
            setHoveredScore(null);
            return;
        }
        setErrorText(null);
        setRating(scoreItem);
        if (scoreItem < 4) {
            setTextAreaLabel(<>
          <p>What can we do to improve it? Please be as detailed as you like.</p>
          <p>I'll read every single review.</p>
        </>);
            setTextAreaPlaceholder('This section is required... how can we do better? ✍️');
        }
        if (scoreItem >= 4) {
            setTextAreaLabel(<>
          <p>Any general feedback you'd like to add?</p>
          <p>I'll take it all... tell me where this website can be improved.</p>
          <p>I'll read every single review.</p>
        </>);
            setTextAreaPlaceholder('This section is optional ✌️');
        }
    };
    // Do not show on Intro page
    if (metadata.source === '@site/docs/index.mdx') {
        return null;
    }
    return (<div className={styles_module_scss_1.default.feedback} id={'feedback'}>
      <div className={styles_module_scss_1.default.form}>
        <div className={styles_module_scss_1.default.topSection}>
          <h3>What did you think of this doc?</h3>
          {isSubmitSuccess ? (<div className={styles_module_scss_1.default.successMessage}>
              <p>Thanks for your feedback.</p>
              {rating >= 3 ? (<p>Feel free to review as many docs pages as you like!</p>) : (<p>
                  I'll continue to review and update the content to make sure the content is high quality.
                </p>)}
            </div>) : (<div className={styles_module_scss_1.default.numberRow}>
              {scores.map(function (star, index) { return (<div className={styles_module_scss_1.default.star} key={star} onClick={function () { return handleScoreClick(star); }} onMouseEnter={function () { return setHoveredScore(index + 1); }} onMouseLeave={function () { return setHoveredScore(-1); }}>
                  {rating >= star ? (<svg width="36" height="36" viewBox="0 0 24 24">
                      <path fill="#ffc107" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                    </svg>) : (<svg width="36" height="36" viewBox="0 0 24 24">
                      <path fill={hoveredScore > index ? '#ffc107' : '#B1BCC7'} d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                    </svg>)}
                </div>); })}
            </div>)}
        </div>
        <div style={rating ? { display: 'block' } : { display: 'none' }}>
          <div className={styles_module_scss_1.default.textAreaLabel}>{textAreaLabel}</div>
          <textarea className={styles_module_scss_1.default.textarea} value={notes !== null && notes !== void 0 ? notes : ''} placeholder={textAreaPlaceholder !== null && textAreaPlaceholder !== void 0 ? textAreaPlaceholder : ''} rows={5} onChange={function (e) { return setNotes(e.target.value); }}/>
          <div className={styles_module_scss_1.default.errorAndButton}>
            <p className={styles_module_scss_1.default.errorText}>{errorText}</p>
            <div className={styles_module_scss_1.default.buttonContainer}>
              <button className={submitDisabled ? styles_module_scss_1.default.buttonDisabled : ''} onClick={function () { return handleSubmit(); }}>
                Send your review!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.Feedback = Feedback;
