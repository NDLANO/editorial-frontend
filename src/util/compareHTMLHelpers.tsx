/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse, { Element, domToReact, DOMNode } from "html-react-parser";
import { renderToStaticMarkup } from "react-dom/server";

// When comparing if content has changed from the published article we need to filter out comments as they are not part of the published article
export const removeCommentTags = (html: string): string => {
  const contentWithoutComments = parse(html, {
    replace(domNode) {
      if (domNode instanceof Element && "attribs" in domNode) {
        if (domNode.attribs["data-resource"] === "comment" && domNode.attribs["data-type"] === "block") {
          return <></>;
        }
        if (domNode.attribs["data-resource"] === "comment" && domNode.attribs["data-type"] === "inline") {
          return <>{domToReact((domNode as Element).children as DOMNode[])}</>;
        }
      }
    },
  });
  return renderToStaticMarkup(contentWithoutComments);
};
