/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';

import { getVisualElementInformation } from '../../util/visualElementHelper';
import { classes } from '../../components/Fields';

const VisualElementInformation = ({ visualElement, locale, embedTag, t }) => {
  if (!visualElement) {
    return null;
  }

  const element = getVisualElementInformation(
    visualElement,
    embedTag.resource,
    locale,
  );
  return (
    <div>
      <span {...classes('visual-element-information')}>
        {element.title
          ? t(`topicArticleForm.visualElementTitle.${embedTag.resource}`)
          : ''}
      </span>
      <span>
        {element.title || ''}
      </span>
      <span {...classes('visual-element-information')}>
        {element.copyright ? t('topicArticleForm.visualElementCopyright') : ''}
      </span>
      <span>
        {element.copyright}
      </span>
    </div>
  );
};

VisualElementInformation.propTypes = {
  visualElement: PropTypes.shape({
    alttexts: PropTypes.arrayOf(PropTypes.object),
    captions: PropTypes.arrayOf(PropTypes.object),
  }),
  locale: PropTypes.string.isRequired,
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
};

export default injectT(VisualElementInformation);
