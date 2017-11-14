/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { classes } from './LearningResourceForm';
import MetaInformation from '../../../components/MetaInformation';

const MetaImage = ({ image, toggleImageSearchLightBox, t }) => {
  const copyright =
    image.copyright && image.copyright.authors
      ? image.copyright.authors.map(author => author.name).join(', ')
      : undefined;
  const title = convertFieldWithFallback(image, 'title', '');
  const alt = convertFieldWithFallback(image, 'alttext', '');
  const imageAction = (
    <Button onClick={toggleImageSearchLightBox}>
      {t('learningResourceForm.metaImage.change')}
    </Button>
  );
  const metaInformationTranslations = {
    title: t('learningResourceForm.metaImage.title'),
    copyright: t('learningResourceForm.metaImage.copyright'),
  };
  return (
    <div {...classes('meta-image')}>
      <img src={image.imageUrl} alt={alt} />
      <MetaInformation
        title={title}
        copyright={copyright}
        action={imageAction}
        translations={metaInformationTranslations}
      />
    </div>
  );
};

MetaImage.propTypes = {
  image: PropTypes.shape({}),
  toggleImageSearchLightBox: PropTypes.func.isRequired,
};

export default injectT(MetaImage);
