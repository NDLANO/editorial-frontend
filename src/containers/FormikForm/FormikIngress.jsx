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
import { connect } from 'formik';
import { RemainingCharacters } from '../../../components/Fields';
import StyledFormContainer from '../../components/SlateEditor/common/StyledFormContainer';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

const FormikIngress = props => {
  const {
    t,
    formik: { values },
  } = props;
  // const { bindInput, schema, submitted } = commonFieldProps;
  // const { value, onChange } = bindInput('introduction');
  return (
    <StyledFormContainer>
      <FormikField
        label={t('form.introduction.label')}
        name="introduction"
        hasFocus={values['introduction'].selection.isFocused}>
        {({ field }) => (
          <Fragment>
            <PlainTextEditor
              id={field.name}
              {...field}
              placeholder={t('form.introduction.label')}
              className="article_introduction"
              data-cy="learning-resource-ingress"
            />
            <RemainingCharacters
              maxLength={300}
              getRemainingLabel={(maxLength, remaining) =>
                t('form.remainingCharacters', { maxLength, remaining })
              }
              value={field.value.document.text}
            />
          </Fragment>
        )}
      </FormikField>
    </StyledFormContainer>
  );
};

FormikIngress.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.array,
  }),
};

export default connect(injectT(FormikIngress));
