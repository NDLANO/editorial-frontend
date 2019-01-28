/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import EditorErrorMessage from '../../EditorErrorMessage';
import { getSchemaEmbed } from '../../editorSchema';

const NoEmbedMessage = ({ text, t, node, attributes }) => {
  const embed = getSchemaEmbed(node);
  const msg =
    text || t('noEmbedMessage.deleteOnSave', { type: embed.resource });

  return <EditorErrorMessage attributes={attributes} msg={msg} />;
};

NoEmbedMessage.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  text: PropTypes.string,
  node: Types.node.isRequired,
};

export default injectT(NoEmbedMessage);
