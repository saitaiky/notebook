import React from "react";
import Content from "@theme-original/DocSidebar/Desktop/Content";

//import VersionedLink from "@site/src/components/VersionedLink"; // It will add /lastest to the url
import Link from "@docusaurus/Link";

import styles from "./customStyles.module.scss";
import useIsBrowser from "@docusaurus/useIsBrowser";

export default function ContentWrapper(props) {
	const isBrowser = useIsBrowser();
	const isConceptDocs =
		isBrowser && window.location.pathname.includes("/tech-concepts/");
	const isSoftwareDevelopmentDocs =
		isBrowser && window.location.pathname.includes("/software-development/");
	const hideSidebar = !isConceptDocs && !isSoftwareDevelopmentDocs;

	if (hideSidebar){
		return (
			<Content {...props} />
		);
	}else{
		return (
			<>
				<div className={styles["doc-sidebar-tabs"]}>
					<Link
						to="/software-development/"
						className={`${styles["link-tab"]} ${isSoftwareDevelopmentDocs ? styles['active'] : ''}`}
					>
						Software Development
					</Link>
					<Link
						to="/tech-concepts/"
						className={`${styles["link-tab"]} ${isConceptDocs ? styles['active'] : ''}`}
					>
						Tech concepts
					</Link>
				</div>
				<Content {...props} />
			</>
		);
	}
}
