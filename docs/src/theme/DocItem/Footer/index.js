import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/theme-common/internal';
import LastUpdated from '@theme/LastUpdated';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';
import styles from './styles.module.css';
import {CommentSection} from '@site/src/components/CommentSection/CommentSection';
import RelatedContent from '@site/src/components/RelatedContent';
import {Feedback} from '@site/src/components/Feedback/Feedback';
// import { HasuraReleaseNotification } from '@site/src/components/HasuraReleaseNotification/HasuraReleaseNotification';

function TagsRow(props) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        'row margin-bottom--sm'
      )}
    >
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}
function EditMetaRow({
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
  formattedLastUpdatedAt,
}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, 'row')}>
      <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx('col', styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  );
}
export default function DocItemFooter() {
  const { metadata } = useDoc();
  const {
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
    tags,
    frontMatter,
  } = metadata;
  const { disableComments } = frontMatter;

  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;
  return (
    <>
      <Feedback metadata={metadata} />
      {/* <HasuraReleaseNotification /> */}
      {canDisplayFooter && (
        <footer
          className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}
        >
          {canDisplayTagsRow && <TagsRow tags={tags} />}
          {canDisplayEditMetaRow && (
            <EditMetaRow
              editUrl={editUrl}
              lastUpdatedAt={lastUpdatedAt}
              lastUpdatedBy={lastUpdatedBy}
              formattedLastUpdatedAt={formattedLastUpdatedAt}
            />
          )}
        </footer>
      )}
      <div className='margin-top--xl'>
        <RelatedContent />
      </div>
      {!disableComments && (
        <div className='margin-top--xl'>
          <CommentSection/>
        </div>
      )}
    </>
  );
}
