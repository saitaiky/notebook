"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var VersionedLink_1 = require("@site/src/components/VersionedLink");
// Create links based on props, we're adding a comma between each product
function createLinks(props) {
    var links = [];
    if (props.ce) {
        links.push(<VersionedLink_1.default key="ce" to="/getting-started/overview">
        Community Edition
      </VersionedLink_1.default>);
    }
    if (props.free) {
        links.push(<VersionedLink_1.default key="free" to="/hasura-cloud/overview/#cloud-free">
        Cloud Free
      </VersionedLink_1.default>);
    }
    if (props.pro) {
        links.push(<VersionedLink_1.default key="pro" to="/hasura-cloud/overview/#cloud-professional">
        Cloud Professional
      </VersionedLink_1.default>);
    }
    if (props.ee) {
        links.push(<VersionedLink_1.default key="ee" to="/hasura-cloud/overview/#cloud-enterprise">
        Cloud Enterprise
      </VersionedLink_1.default>);
    }
    if (props.self) {
        links.push(<VersionedLink_1.default key="self" to="/enterprise/overview">
        Self-Hosted Enterprise
      </VersionedLink_1.default>);
    }
    return links.map(function (link, index) {
        if (index === links.length - 1) {
            return link;
        }
        return [link, ', '];
    });
}
var ProductBadge = function (props) { return (<div className="badge badge--primary heading-badge">Available on: {createLinks(props)}</div>); };
exports.default = ProductBadge;
