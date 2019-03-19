/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from 'react-emotion';
import Button from '@ndla/button';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { formClasses } from '../';
import MetaInformation from '../../../components/MetaInformation';
import { TextField } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';

const metaImageButtonStyle = css`
  display: block;
`;

const FormMetaImage = ({
  image,
  toggleImageSearchLightBox,
  commonFieldProps,
  t,
}) => {
  const copyright =
    image.copyright && image.copyright.creators
      ? image.copyright.creators.map(creator => creator.name).join(', ')
      : undefined;
  const title = convertFieldWithFallback(image, 'title', '');
  const alt = convertFieldWithFallback(image, 'alttext', '');
  const imageAction = (
    <Button css={metaImageButtonStyle} onClick={toggleImageSearchLightBox}>
      {t('learningResourceForm.metaImage.change')}
    </Button>
  );
  const metaInformationTranslations = {
    title: t('learningResourceForm.metaImage.title'),
    copyright: t('learningResourceForm.metaImage.copyright'),
  };
  return (
    <Fragment>
      <div {...formClasses('meta-image')}>
        <img src={image.imageUrl} alt={alt} />
        <MetaInformation
          title={title}
          copyright={copyright}
          action={imageAction}
          translations={metaInformationTranslations}
        />
      </div>
      <TextField
        placeholder={t('topicArticleForm.fields.alt.placeholder')}
        label={t('topicArticleForm.fields.alt.label')}
        name="metaImageAlt"
        {...commonFieldProps}
        noBorder
        maxLength={300}
      />
    </Fragment>
  );
};

FormMetaImage.propTypes = {
  image: PropTypes.shape({}),
  toggleImageSearchLightBox: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

export default injectT(FormMetaImage);
