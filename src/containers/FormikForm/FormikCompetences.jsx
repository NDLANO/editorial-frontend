/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import FormikField from '../../components/FormikField';
import FormikCompetencesContent from './FormikCompetencesContent';

const FormikCompetences = ({ t, article }) => {
  return (
    <Fragment>
      <FormikField name="competences" label={t('form.competences.label')}>
        {({ field, form }) => (
          <FormikCompetencesContent
            t
            articleCompetences={article.competences}
            field={field}
            form={form}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

FormikCompetences.propTypes = {
  article: PropTypes.shape({
    competences: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default injectT(FormikCompetences);
