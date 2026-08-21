import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';

// https://dev.to/m19v/how-to-add-giscus-comments-to-docusaurus-439h
import { useBlogPost } from '@docusaurus/theme-common/internal'
import {CommentSection} from '@site/src/components/CommentSection/CommentSection';
import RelatedContent from '@site/src/components/RelatedContent';
import {Feedback} from '@site/src/components/Feedback/Feedback';

export default function BlogPostItemWrapper(props) {

  const { metadata, isBlogPostPage } = useBlogPost()

  const { frontMatter: {disableComments}} = metadata
  return (
    <>
      <BlogPostItem {...props} />
      {isBlogPostPage && <Feedback metadata={metadata} />}
      {isBlogPostPage && (
        <div className='margin-top--xl'>
          <RelatedContent />
        </div>
      )}
      {(!disableComments && isBlogPostPage) && (
        <CommentSection />
      )}
    </>
  );
}
