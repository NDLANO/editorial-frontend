/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { titlesI18N } from '../../util/i18nFieldFinder';
import { classes } from '../../components/Fields';
import { injectT } from '../../i18n';

const VisualElementInformation = ({ visualElement, locale, embedTag, t }) => {
  if (!visualElement) {
    return null;
  }
  const title = titlesI18N(visualElement, locale, true);
  const copyright = visualElement.copyright && visualElement.copyright.authors
    ? visualElement.copyright.authors.map(author => author.name).join(', ')
    : undefined;
  return (
    <div>
      <span {...classes('visual-element-information')}>
        {title
          ? t(`topicArticleForm.visualElementTitle.${embedTag.resource}`)
          : ''}
      </span>
      <span>{title || ''}</span>
      <span {...classes('visual-element-information')}>
        {copyright ? t('topicArticleForm.visualElementCopyright') : ''}
      </span>
      <span>{copyright}</span>
    </div>
  );
};

VisualElementInformation.propTypes = {
  visualElement: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
};

export default injectT(VisualElementInformation);
