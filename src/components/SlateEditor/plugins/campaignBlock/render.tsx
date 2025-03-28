/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateCampaignBlock from "./SlateCampaignBlock";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "./types";

export const campaignBlockRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === CAMPAIGN_BLOCK_ELEMENT_TYPE) {
      return (
        <SlateCampaignBlock editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateCampaignBlock>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
