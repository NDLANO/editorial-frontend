/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Node } from 'slate';
import { RenderElementProps } from 'slate-react';
import { injectT, tType } from '@ndla/i18n';
import EditorErrorMessage from '../../EditorErrorMessage';
import { EmbedElement } from '../embed';

interface Props {
  attributes: RenderElementProps['attributes'];
  element: EmbedElement;
}

const NoEmbedMessage = ({ t, attributes, element }: Props & tType) => {
  const text = Node.string(element);
  const embed = element.data;
  const msg = text.length > 0 ? text : t('noEmbedMessage.deleteOnSave', { type: embed.resource });

  return <EditorErrorMessage attributes={attributes} msg={msg} />;
};

export default injectT(NoEmbedMessage);
