import React from "react";
import Content from "@theme-original/DocSidebar/Desktop/Content";

//import VersionedLink from "@site/src/components/VersionedLink"; // It will add /lastest to the url
import Link from "@docusaurus/Link";

import styles from "./customStyles.module.scss";
import useIsBrowser from "@docusaurus/useIsBrowser";

export default function ContentWrapper(props) {
	const isBrowser = useIsBrowser();
	const isCryptoDocs =
		isBrowser && window.location.pathname.includes("/crypto/");
	const isWebDevelopmentDocs =
		isBrowser && window.location.pathname.includes("/web-development/");
	return (
		<>
			<div className={styles["doc-sidebar-tabs"]}>
				<Link
					to="/web-development/"
					className={`${styles["link-tab"]} ${isWebDevelopmentDocs ? styles['active'] : ''}`}
				>
					Web Development
				</Link>
				<Link
					to="/tech-concepts/"
					className={`${styles["link-tab"]} ${isCryptoDocs ? styles['active'] : ''}`}
				>
					Tech concepts
				</Link>
			</div>
			<Content {...props} />
		</>
	);
}
