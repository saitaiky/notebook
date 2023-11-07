import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';

// https://dev.to/m19v/how-to-add-giscus-comments-to-docusaurus-439h
import { useBlogPost } from '@docusaurus/theme-common/internal'
import { GiscusComponent } from '@site/src/components/GiscusComponent/GiscusComponent';

export default function BlogPostItemWrapper(props) {

  const { metadata, isBlogPostPage } = useBlogPost()

  const { frontMatter: {disableComments}} = metadata
  return (
    <>
      <BlogPostItem {...props} />
      {(!disableComments && isBlogPostPage) && (
        <GiscusComponent />
      )}
    </>
  );
}
