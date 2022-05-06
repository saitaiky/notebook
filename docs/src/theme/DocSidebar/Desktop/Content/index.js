import React from "react";
import Content from "@theme-original/DocSidebar/Desktop/Content";
import VersionedLink from "@site/src/components/VersionedLink";
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
				<VersionedLink
					to="/web-development/index/"
					className={`${styles["link-tab"]} ${isWebDevelopmentDocs ? styles['active'] : ''}`}
				>
					Web Development
				</VersionedLink>
				<VersionedLink
					to="/crypto/index/"
					className={`${styles["link-tab"]} ${isCryptoDocs ? styles['active'] : ''}`}
				>
					Crypto
				</VersionedLink>
			</div>
			<Content {...props} />
		</>
	);
}
