"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var styles_module_scss_1 = require("./styles.module.scss");
var Player = function (props) {
    var src = props.src, _a = props.autoPlay, autoPlay = _a === void 0 ? true : _a, _b = props.loop, loop = _b === void 0 ? true : _b, _c = props.muted, muted = _c === void 0 ? true : _c, _d = props.playsInline, playsInline = _d === void 0 ? true : _d, _e = props.showControls, showControls = _e === void 0 ? false : _e;
    var resolvedVideo = require("@site/static".concat(src)).default;
    return (<div className={"".concat(styles_module_scss_1.default['player'])}>
      <video autoPlay={autoPlay} loop={loop} muted={muted} playsInline={playsInline} controls={showControls}>
        <source src={resolvedVideo} type="video/webm"/>
      </video>
    </div>);
};
exports.default = Player;
