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
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { formClasses } from '../';
import MetaInformation from '../../../components/MetaInformation';
import FormikField from '../../../components/FormikField';

const metaImageButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

const metaImageDeleteButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
  min-height: 2.1rem;
  background-color: #ba292e;
  border: #ba292e;
  :hover {
    background-color: #8f2024;
    border: 0;
  }
  :focus {
    background-color: #8f2024;
  }
`;

const FormikMetaImage = ({
  image,
  onImageSelectOpen,
  onImageRemove,
  showRemoveButton,
  t,
}) => {
  const copyright =
    image.copyright && image.copyright.creators
      ? image.copyright.creators.map(creator => creator.name).join(', ')
      : undefined;
  const title = convertFieldWithFallback(image, 'title', '');
  const alt = convertFieldWithFallback(image, 'alttext', '');
  const imageAction = (
    <>
      <Button css={metaImageButtonStyle} onClick={onImageSelectOpen}>
        {t('form.metaImage.change')}
      </Button>
      {showRemoveButton && (
        <Button css={metaImageDeleteButtonStyle} onClick={onImageRemove}>
          {t('form.metaImage.remove')}
        </Button>
      )}
    </>
  );
  const metaInformationTranslations = {
    title: t('form.metaImage.imageTitle'),
    copyright: t('form.metaImage.copyright'),
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

      <FormikField
        label={t('topicArticleForm.fields.alt.label')}
        name="metaImageAlt"
        noBorder
        placeholder={t('topicArticleForm.fields.alt.placeholder')}
        maxLength={300}
      />
    </Fragment>
  );
};

FormikMetaImage.propTypes = {
  image: PropTypes.shape({
    copyright: PropTypes.object,
    imageUrl: PropTypes.string,
  }),
  onImageSelectOpen: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func,
  showRemoveButton: PropTypes.bool,
};

export default injectT(FormikMetaImage);
