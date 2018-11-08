/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import { formClasses } from '../../Form';
import {
  PlainTextField,
  RemainingCharacters,
  classes as fieldClasses,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';

const LearningResourceIngress = props => {
  const { t, commonFieldProps } = props;
  const { bindInput } = commonFieldProps;

  return (
    <div {...formClasses('container')}>
      <PlainTextField
        label={t('form.introduction.label')}
        placeholder={t('form.introduction.label')}
        name="introduction"
        className="article_introduction"
        fieldClassName={fieldClasses(undefined, 'introduction').className}
        noBorder
        maxLength={300}
        data-cy="learning-resource-ingress"
        {...commonFieldProps}>
        <RemainingCharacters
          maxLength={300}
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })
          }
          value={bindInput('introduction').value.document.text}
        />
      </PlainTextField>
    </div>
  );
};

LearningResourceIngress.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

export default injectT(LearningResourceIngress);
