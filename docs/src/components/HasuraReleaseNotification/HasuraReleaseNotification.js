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
exports.HasuraReleaseNotification = void 0;
var react_1 = require("react");
require("./styles.css");
var ENDPOINT_URL = 'https://hasura.io/changelog/api/items?offset=0&product=cloud&limit=10';
var fetchNewReleases = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(ENDPOINT_URL)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data.data.map(function (entry) { return entry.version; })];
        }
    });
}); };
var HasuraReleaseNotification = function () {
    (0, react_1.useEffect)(function () {
        /**
         * Adds or removes the blue dot from the "What's new" link
         * @param {boolean} newReleaseFound
         */
        var updateDot = function (newReleaseFound) {
            var link = document.getElementById('whats-new-link');
            if (newReleaseFound) {
                link.classList.add('blue-dot');
            }
            else {
                link.classList.remove('blue-dot');
            }
        };
        /**
         * Fetches the latest releases and updates the blue dot
         */
        var fetchReleases = function () { return __awaiter(void 0, void 0, void 0, function () {
            var releases, seenReleases, newReleaseFound;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchNewReleases()];
                    case 1:
                        releases = _a.sent();
                        seenReleases = JSON.parse(localStorage.getItem('seenReleases')) || [];
                        newReleaseFound = false;
                        releases.forEach(function (release) {
                            if (!seenReleases.includes(release)) {
                                newReleaseFound = true;
                            }
                        });
                        updateDot(newReleaseFound);
                        return [2 /*return*/];
                }
            });
        }); };
        // Fetch releases on page load
        fetchReleases();
        // Add event listener to "What's new" link to detect when user goes to see new releases on changelog page
        // At the same time update the local storage to mark the new releases as seen
        var whatsNewLink = document.getElementById('whats-new-link');
        whatsNewLink.addEventListener('click', function () {
            fetchNewReleases().then(function (newReleases) {
                var seenReleases = JSON.parse(localStorage.getItem('seenReleases')) || [];
                newReleases.forEach(function (release) {
                    if (!seenReleases.includes(release)) {
                        seenReleases.push(release);
                    }
                });
                localStorage.setItem('seenReleases', JSON.stringify(seenReleases));
            });
            // Clear the blue dot
            updateDot(false);
        });
    }, []);
    return null;
};
exports.HasuraReleaseNotification = HasuraReleaseNotification;
