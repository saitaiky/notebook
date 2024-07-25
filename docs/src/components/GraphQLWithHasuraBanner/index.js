"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Link_1 = require("@docusaurus/Link");
var arrow_right_svg_1 = require("@site/static/icons/arrow_right.svg");
var star_svg_1 = require("@site/static/img/star.svg");
var hasura_free_png_1 = require("@site/static/img/hasura-free.png");
var styles_module_scss_1 = require("./styles.module.scss");
var GraphQLWithHasuraBanner = function () {
    return (<Link_1.default className={styles_module_scss_1.default["remove-text-decoration"]} href="https://cloud.hasura.io/signup?pg=docs&plcmt=pre-footer&cta=try-graphql-with-hasura&tech=default">
      <div className={styles_module_scss_1.default["graphql-with-hasura-wrapper"]}>
        <div className={styles_module_scss_1.default["p40"]}>
          <h3>
            Start with GraphQL on Hasura for Free
          </h3>
          <ul className={styles_module_scss_1.default["desc"]}>
            <li>
              <star_svg_1.default />
              Build apps and APIs 10x faster
            </li>
            <li>
              <star_svg_1.default />
              Built-in authorization and caching
            </li>
            <li>
              <star_svg_1.default />
              8x more performant than hand-rolled APIs
            </li>
          </ul>
          <div className={styles_module_scss_1.default["try-hasura-div"]}>
            Try GraphQL with Hasura
            <div className={styles_module_scss_1.default["arrow"]}>
              <arrow_right_svg_1.default />
            </div>
          </div>
        </div>
        <div className={styles_module_scss_1.default["show-mobile"]}>
          <img src={hasura_free_png_1.default} alt="Promo"/>
        </div>
      </div>
    </Link_1.default>);
};
exports.default = GraphQLWithHasuraBanner;
