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
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-ui/icons';

import {
  PlainTextField,
  RemainingCharacters,
  classes as fieldClasses,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'learning-resource-form',
  prefix: 'c-',
});

const LearningResourceIngress = props => {
  const { value, onChange, name, commonFieldProps, t } = props;
  if (!value) {
    return null;
  }

  const removeIngress = () => {
    onChange({
      target: {
        name,
        value: undefined,
      },
    });
  };

  return (
    <div {...classes('container')}>
      <PlainTextField
        label={t('form.introduction.label')}
        placeholder={t('form.introduction.label')}
        name="introduction"
        className="article_introduction"
        fieldClassName={fieldClasses(undefined, 'introduction').className}
        noBorder
        maxLength={300}
        {...commonFieldProps}>
        <RemainingCharacters
          maxLength={300}
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })}
          value={value.document.text}
        />
        <Button
          stripped
          onClick={removeIngress}
          {...classes('delete-block-button')}>
          <Cross />
        </Button>
      </PlainTextField>
    </div>
  );
};

LearningResourceIngress.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

export default injectT(LearningResourceIngress);
