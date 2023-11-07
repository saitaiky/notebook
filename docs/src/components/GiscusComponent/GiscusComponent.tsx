import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export const GiscusComponent = () => {
  
  const { colorMode } = useColorMode();

  return (
    <Giscus    
      repo="saitaiky/notebook"
      repoId="R_kgDOKhKTsA"
      category="Announcements"
      categoryId="DIC_kwDOKhKTsM4CarA6"  // E.g. id of "Announcements"
      mapping="pathname"                        // Important! To map comments to URL
      term="Welcome to @giscus/react component!"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={colorMode}
      lang="en"
      loading="lazy"
    //   crossorigin="anonymous"
    //   async
    />
  );
}