/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import { isSlateEmbedElement } from '../embed/utils';
import NoEmbedMessage from './NoEmbedMessage';

export const noEmbedRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (isSlateEmbedElement(element)) {
      return <NoEmbedMessage attributes={attributes} element={element} />;
    } else return renderElement?.({ attributes, element, children });
  };

  return editor;
};
